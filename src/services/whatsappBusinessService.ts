import axios from 'axios';
import GeminiService from './geminiService.js';

interface WhatsAppMessage {
  id: string;
  from: string;
  type: string;
  timestamp: string;
  text?: {
    body: string;
  };
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}

class WhatsAppBusinessService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  private verifyToken: string;
  private geminiService: GeminiService;

  constructor() {
    this.apiUrl = import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
    this.verifyToken = import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN || '';
    this.geminiService = new GeminiService();
  }

  // Verificar webhook (usado para configurar webhook no Facebook)
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  // Processar mensagens recebidas via webhook
  async processWebhook(payload: WhatsAppWebhookPayload): Promise<void> {
    try {
      if (payload.object !== 'whatsapp_business_account') {
        return;
      }

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages' && change.value.messages) {
            for (const message of change.value.messages) {
              await this.handleIncomingMessage(message, change.value);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
    }
  }

  // Lidar com mensagens recebidas
  private async handleIncomingMessage(message: WhatsAppMessage, value: any): Promise<void> {
    try {
      const senderId = message.from;
      const messageText = message.text?.body || '';

      console.log(`Nova mensagem de ${senderId}: ${messageText}`);

      // Gerar resposta inteligente usando Gemini AI
      const aiResponse = await this.geminiService.generateResponse(
        messageText,
        'Você é um assistente de atendimento ao cliente amigável e prestativo. Responda de forma profissional, útil e em português brasileiro.'
      );

      // Enviar resposta
      await this.sendMessage(senderId, aiResponse);

    } catch (error) {
      console.error('Erro ao lidar com mensagem:', error);
      // Enviar mensagem de erro
      try {
        await this.sendMessage(message.from, 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.');
      } catch (sendError) {
        console.error('Erro ao enviar mensagem de erro:', sendError);
      }
    }
  }

  // Enviar mensagem
  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Mensagem enviada:', response.data);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  // Verificar status da API
  async checkStatus(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return false;
    }
  }

  // Obter informações do número
  async getPhoneNumberInfo(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do número:', error);
      return null;
    }
  }
}

export default WhatsAppBusinessService;
export type { WhatsAppMessage, WhatsAppWebhookPayload };