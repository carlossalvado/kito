import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import axios from 'axios';
import WhatsAppBusinessService from './src/services/whatsappBusinessService.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

app.use(cors());
app.use(express.json());

// Initialize WhatsApp Business Service
const whatsappService = new WhatsAppBusinessService();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-whatsapp-auth', async (userId) => {
    try {
      console.log(`Starting WhatsApp auth for user: ${userId}`);

      // Create new WhatsApp client for this user
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: userId }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        }
      });

      whatsappClients.set(userId, client);

      client.on('qr', async (qr) => {
        console.log(`QR Code generated for user: ${userId}`);
        try {
          const qrCodeDataURL = await qrcode.toDataURL(qr);
          socket.emit('whatsapp-qr', { qr: qrCodeDataURL, userId });
        } catch (error) {
          console.error('Error generating QR code:', error);
          socket.emit('whatsapp-error', { error: 'Erro ao gerar QR code', userId });
        }
      });

      client.on('ready', () => {
        console.log(`WhatsApp client ready for user: ${userId}`);
        socket.emit('whatsapp-ready', { userId });
      });

      client.on('disconnected', (reason) => {
        console.log(`WhatsApp disconnected for user: ${userId}, reason:`, reason);
        socket.emit('whatsapp-disconnected', { reason, userId });
        whatsappClients.delete(userId);
      });

      client.on('auth_failure', (msg) => {
        console.error(`WhatsApp auth failure for user: ${userId}:`, msg);
        socket.emit('whatsapp-auth-failure', { msg, userId });
        whatsappClients.delete(userId);
      });

      await client.initialize();

    } catch (error) {
      console.error(`Error starting WhatsApp auth for user ${userId}:`, error);
      socket.emit('whatsapp-error', { error: error.message, userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// WhatsApp Business API Webhook
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const result = whatsappService.verifyWebhook(mode, token, challenge);

  if (result) {
    res.status(200).send(result);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const payload = req.body;
    await whatsappService.processWebhook(payload);
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// API endpoint to check WhatsApp Business status
app.get('/api/whatsapp/status', async (req, res) => {
  try {
    const isConnected = await whatsappService.checkStatus();
    if (isConnected) {
      const phoneInfo = await whatsappService.getPhoneNumberInfo();
      res.json({
        status: 'ready',
        phoneInfo
      });
    } else {
      res.json({ status: 'not_ready' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

// API endpoint to send test message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    const success = await whatsappService.sendMessage(to, message);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WhatsApp server running on port ${PORT}`);
});