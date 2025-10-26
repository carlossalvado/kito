import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:3001', {
      transports: ['polling', 'websocket'],
      forceNew: true,
      timeout: 20000
    });

    this.socket.on('connect', () => {
      console.log('Connected to WhatsApp server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WhatsApp server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect(userId);
    });

    return this.socket;
  }

  private handleReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

      setTimeout(() => {
        this.connect(userId);
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  startWhatsAppAuth(userId: string) {
    if (this.socket) {
      this.socket.emit('start-whatsapp-auth', userId);
    }
  }

  onQR(callback: (data: { qr: string; userId: string }) => void) {
    this.socket?.on('whatsapp-qr', callback);
  }

  onReady(callback: (data: { userId: string }) => void) {
    this.socket?.on('whatsapp-ready', callback);
  }

  onDisconnected(callback: (data: { reason: string; userId: string }) => void) {
    this.socket?.on('whatsapp-disconnected', callback);
  }

  onAuthFailure(callback: (data: { msg: string; userId: string }) => void) {
    this.socket?.on('whatsapp-auth-failure', callback);
  }

  onError(callback: (data: { error: string; userId: string }) => void) {
    this.socket?.on('whatsapp-error', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketService;