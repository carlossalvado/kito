import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, MessageSquare, CheckCircle } from "lucide-react";

export function ApiKeysCard() {
  const whatsappApiUrl = import.meta.env.VITE_WHATSAPP_API_URL;
  const whatsappToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
  const whatsappPhoneId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-secondary">
            <Key className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle>Status das APIs</CardTitle>
            <CardDescription>Verifique se todas as APIs estão configuradas corretamente</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              WhatsApp Business API
            </span>
            {whatsappToken && whatsappPhoneId ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configurado
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Não configurado
              </Badge>
            )}
          </div>
          {whatsappApiUrl && (
            <p className="text-xs text-muted-foreground">
              API URL: {whatsappApiUrl}
            </p>
          )}
          {whatsappPhoneId && (
            <p className="text-xs text-muted-foreground">
              Phone ID: {whatsappPhoneId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Key className="h-4 w-4" />
              Google Gemini AI
            </span>
            {geminiApiKey ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configurado
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Não configurado
              </Badge>
            )}
          </div>
          {geminiApiKey && (
            <p className="text-xs text-muted-foreground">
              Chave configurada e pronta para uso
            </p>
          )}
        </div>

        {(!whatsappToken || !whatsappPhoneId || !geminiApiKey) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-1">
              ⚠️ Configuração incompleta
            </p>
            <p className="text-xs text-yellow-700">
              Algumas APIs não estão configuradas. Verifique o arquivo .env do servidor.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
