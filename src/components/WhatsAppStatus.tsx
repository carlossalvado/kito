import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle, AlertCircle, RefreshCw, Power, PowerOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocketService from "@/services/socketService";
import { useAuth } from "@/hooks/useAuth";

interface WhatsAppStatusProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function WhatsAppStatus({ onConnectionChange }: WhatsAppStatusProps) {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const socketServiceRef = useRef<SocketService | null>(null);

  useEffect(() => {
    if (userId) {
      checkConnectionStatus();
    }

    return () => {
      if (socketServiceRef.current) {
        socketServiceRef.current.disconnect();
      }
    };
  }, [userId]);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/whatsapp/status');
      const data = await response.json();

      if (data.status === 'ready') {
        setIsConnected(true);
        onConnectionChange?.(true);
      } else {
        setIsConnected(false);
        onConnectionChange?.(false);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setIsConnected(false);
      onConnectionChange?.(false);
    }
  };

  const startConnection = () => {
    if (!userId) return;

    setIsLoading(true);
    setError("");
    setQrCode("");

    socketServiceRef.current = new SocketService();
    const socket = socketServiceRef.current.connect(userId);

    if (socket) {
      socketServiceRef.current.onQR((data) => {
        if (data.userId === userId) {
          setQrCode(data.qr);
          setIsLoading(false);
        }
      });

      socketServiceRef.current.onReady((data) => {
        if (data.userId === userId) {
          setIsConnected(true);
          setQrCode("");
          setIsLoading(false);
          onConnectionChange?.(true);
          toast({
            title: "Conectado com sucesso!",
            description: "WhatsApp conectado e pronto para uso.",
          });
        }
      });

      socketServiceRef.current.onDisconnected((data) => {
        if (data.userId === userId) {
          setIsConnected(false);
          setQrCode("");
          onConnectionChange?.(false);
          toast({
            title: "Desconectado",
            description: `Conexão perdida: ${data.reason}`,
            variant: "destructive",
          });
        }
      });

      socketServiceRef.current.onAuthFailure((data) => {
        if (data.userId === userId) {
          setError(`Falha na autenticação: ${data.msg}`);
          setIsLoading(false);
          toast({
            title: "Falha na autenticação",
            description: "Erro ao conectar com WhatsApp.",
            variant: "destructive",
          });
        }
      });

      socketServiceRef.current.onError((data) => {
        if (data.userId === userId) {
          setError(data.error);
          setIsLoading(false);
        }
      });

      socketServiceRef.current.startWhatsAppAuth(userId);
    }
  };

  const disconnect = async () => {
    // WhatsApp Business API não precisa de desconexão manual
    // A conexão é mantida através do webhook
    setIsConnected(false);
    setQrCode("");
    onConnectionChange?.(false);

    toast({
      title: "Status atualizado",
      description: "Verificação de status desabilitada.",
    });
  };

  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-secondary">
            <Smartphone className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle>WhatsApp Business API</CardTitle>
            <CardDescription>Configure a API do WhatsApp Business para receber e enviar mensagens automaticamente</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>

        {/* Connection Controls */}
        <div className="text-center space-y-4">
          <Button onClick={checkConnectionStatus} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Verificar Status da API
          </Button>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">
              ✅ Sistema SaaS Configurado
            </p>
            <p className="text-xs text-green-700 mb-3">
              Você (desenvolvedor) configura as APIs centrais. Usuários personalizam apenas os bots.
            </p>
            <div className="text-left space-y-2 text-xs">
              <p className="font-medium text-green-800">🔧 Suas configurações (no .env):</p>
              <p className="text-green-700">• WhatsApp Business API Token</p>
              <p className="text-green-700">• Phone Number ID</p>
              <p className="text-green-700">• Google Gemini API Key</p>
              <p className="text-green-700">• Webhook configurado no Facebook</p>

              <p className="font-medium text-green-800 mt-3">👥 Usuários configuram:</p>
              <p className="text-green-700">• Prompts e personalização do bot</p>
              <p className="text-green-700">• Parâmetros de voz e temperatura</p>
              <p className="text-green-700">• Configurações avançadas</p>
            </div>
          </div>
        </div>

        {/* Footer Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Certifique-se de ter o WhatsApp Business instalado no seu celular</p>
          <p>• O dispositivo deve estar conectado à internet</p>
          <p>• Mantenha o aplicativo aberto durante o uso</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}