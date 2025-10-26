import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  private client: Client;
  private qrCode: string = '';
  private isReady: boolean = false;
  private onQrCallback?: (qr: string) => void;
  private onReadyCallback?: () => void;
  private onDisconnectedCallback?: () => void;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
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

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('QR Code recebido:', qr);
      this.qrCode = qr;
      qrcode.generate(qr, { small: true });
      this.onQrCallback?.(qr);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp está pronto!');
      this.isReady = true;
      this.onReadyCallback?.();
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp desconectado:', reason);
      this.isReady = false;
      this.onDisconnectedCallback?.();
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Falha na autenticação:', msg);
      this.isReady = false;
    });
  }

  async initialize() {
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error);
      throw error;
    }
  }

  onQr(callback: (qr: string) => void) {
    this.onQrCallback = callback;
  }

  onReady(callback: () => void) {
    this.onReadyCallback = callback;
  }

  onDisconnected(callback: () => void) {
    this.onDisconnectedCallback = callback;
  }

  getQrCode(): string {
    return this.qrCode;
  }

  isAuthenticated(): boolean {
    return this.isReady;
  }

  async logout() {
    try {
      await this.client.logout();
      this.isReady = false;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  async destroy() {
    try {
      await this.client.destroy();
    } catch (error) {
      console.error('Erro ao destruir cliente:', error);
    }
  }

  // Método para obter informações do usuário
  async getUserInfo() {
    if (!this.isReady) return null;

    try {
      const info = this.client.info;
      return {
        wid: info.wid,
        pushname: info.pushname,
        platform: info.platform
      };
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }
}

export default WhatsAppService;