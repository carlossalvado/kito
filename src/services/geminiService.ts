import axios from 'axios';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const prompt = context
        ? `${context}\n\nMensagem do usuário: ${message}\n\nResponda de forma útil e amigável:`
        : `Você é um assistente de IA útil e amigável. Responda à seguinte mensagem: ${message}`;

      const requestData: GeminiRequest = {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      };

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }

      return 'Desculpe, não consegui gerar uma resposta no momento.';

    } catch (error) {
      console.error('Erro ao gerar resposta com Gemini:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    }
  }

  async generateResponseWithContext(
    message: string,
    systemPrompt: string,
    conversationHistory?: Array<{role: string, content: string}>
  ): Promise<string> {
    try {
      let fullPrompt = systemPrompt + '\n\n';

      if (conversationHistory && conversationHistory.length > 0) {
        fullPrompt += 'Histórico da conversa:\n';
        conversationHistory.forEach(msg => {
          fullPrompt += `${msg.role}: ${msg.content}\n`;
        });
        fullPrompt += '\n';
      }

      fullPrompt += `Mensagem atual: ${message}\n\nResponda de forma apropriada:`;

      const requestData: GeminiRequest = {
        contents: [{
          role: 'user',
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      };

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }

      return 'Desculpe, não consegui gerar uma resposta no momento.';

    } catch (error) {
      console.error('Erro ao gerar resposta com contexto:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    }
  }
}

export default GeminiService;