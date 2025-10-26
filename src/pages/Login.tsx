import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocketService from "@/services/socketService";

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const socketServiceRef = useRef<SocketService | null>(null);
  const userIdRef = useRef<string>(`user_${Date.now()}`);

  useEffect(() => {
    initializeSocketConnection();

    return () => {
      if (socketServiceRef.current) {
        socketServiceRef.current.disconnect();
      }
    };
  }, []);

  const initializeSocketConnection = () => {
    try {
      setIsLoading(true);
      setError("");

      socketServiceRef.current = new SocketService();
      const socket = socketServiceRef.current.connect(userIdRef.current);

      if (socket) {
        // Setup event listeners
        socketServiceRef.current.onQR((data) => {
          if (data.userId === userIdRef.current) {
            setQrCode(data.qr);
            setIsLoading(false);
          }
        });

        socketServiceRef.current.onReady((data) => {
          if (data.userId === userIdRef.current) {
            setIsConnected(true);
            setIsLoading(false);
            toast({
              title: "Conectado com sucesso!",
              description: "Você foi autenticado via WhatsApp.",
            });
            onLogin(userIdRef.current);
          }
        });

        socketServiceRef.current.onDisconnected((data) => {
          if (data.userId === userIdRef.current) {
            setIsConnected(false);
            setQrCode("");
            setError(`Conexão perdida: ${data.reason}`);
            toast({
              title: "Conexão perdida",
              description: "A conexão com WhatsApp foi interrompida.",
              variant: "destructive",
            });
          }
        });

        socketServiceRef.current.onAuthFailure((data) => {
          if (data.userId === userIdRef.current) {
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
          if (data.userId === userIdRef.current) {
            setError(data.error);
            setIsLoading(false);
          }
        });

        // Start WhatsApp authentication
        socketServiceRef.current.startWhatsAppAuth(userIdRef.current);
      }
    } catch (err) {
      console.error("Erro ao inicializar conexão:", err);
      setError("Erro ao conectar com o servidor. Verifique sua conexão.");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (socketServiceRef.current) {
      socketServiceRef.current.disconnect();
    }
    // Generate new user ID for retry
    userIdRef.current = `user_${Date.now()}`;
    initializeSocketConnection();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Login com WhatsApp</CardTitle>
          <CardDescription>
            Escaneie o QR code com seu WhatsApp para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <p className="text-lg font-medium text-red-600">
                Erro de Conexão
              </p>
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          ) : !isConnected ? (
            <>
              {isLoading ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <RefreshCw className="h-16 w-16 text-primary animate-spin" />
                  </div>
                  <p className="text-lg font-medium">
                    Inicializando WhatsApp...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aguarde enquanto preparamos a conexão
                  </p>
                </div>
              ) : qrCode ? (
                <>
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Abra o WhatsApp no seu celular e escaneie o código acima
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Aguardando conexão...
                    </div>
                  </div>
                  <Button onClick={handleRetry} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Gerar Novo QR Code
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <AlertCircle className="h-16 w-16 text-yellow-500" />
                  </div>
                  <p className="text-lg font-medium">
                    QR Code não disponível
                  </p>
                  <Button onClick={handleRetry} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-lg font-medium text-green-600">
                Conectado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o painel...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;