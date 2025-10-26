import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, MessageSquare } from "lucide-react";

interface ApiKeysCardProps {
  whatsappToken: string;
  geminiKey: string;
  onWhatsappTokenChange: (value: string) => void;
  onGeminiKeyChange: (value: string) => void;
}

export function ApiKeysCard({
  whatsappToken,
  geminiKey,
  onWhatsappTokenChange,
  onGeminiKeyChange,
}: ApiKeysCardProps) {
  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-secondary">
            <Key className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>Configure suas credenciais de integração</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp-token" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Token da API do WhatsApp
          </Label>
          <Input
            id="whatsapp-token"
            type="password"
            placeholder="Digite o token da API oficial do WhatsApp"
            value={whatsappToken}
            onChange={(e) => onWhatsappTokenChange(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gemini-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Chave de API do Gemini
          </Label>
          <Input
            id="gemini-key"
            type="password"
            placeholder="Digite a chave de API do Google Gemini"
            value={geminiKey}
            onChange={(e) => onGeminiKeyChange(e.target.value)}
            className="font-mono"
          />
        </div>
      </CardContent>
    </Card>
  );
}
