import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings, MessageSquare, Clock, Users } from "lucide-react";

interface AdvancedSettingsProps {
  settings: {
    autoReply: boolean;
    replyDelay: number;
    maxConversations: number;
    workingHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    welcomeMessage: string;
    offlineMessage: string;
    language: string;
  };
  onSettingsChange: (settings: any) => void;
}

export function AdvancedSettings({ settings, onSettingsChange }: AdvancedSettingsProps) {
  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleWorkingHoursChange = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      workingHours: {
        ...settings.workingHours,
        [key]: value
      }
    });
  };

  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-secondary">
            <Settings className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>Personalize o comportamento do seu agente</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resposta Automática */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Resposta Automática
              </Label>
              <p className="text-sm text-muted-foreground">
                Ativar respostas automáticas do agente
              </p>
            </div>
            <Switch
              checked={settings.autoReply}
              onCheckedChange={(checked) => handleSettingChange('autoReply', checked)}
            />
          </div>
        </div>

        {/* Delay de Resposta */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Delay de Resposta (segundos)
          </Label>
          <Input
            type="number"
            min="0"
            max="300"
            value={settings.replyDelay}
            onChange={(e) => handleSettingChange('replyDelay', parseInt(e.target.value) || 0)}
            placeholder="Ex: 5"
          />
          <p className="text-xs text-muted-foreground">
            Tempo de espera antes de enviar resposta automática
          </p>
        </div>

        {/* Máximo de Conversas Simultâneas */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Máximo de Conversas Simultâneas
          </Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={settings.maxConversations}
            onChange={(e) => handleSettingChange('maxConversations', parseInt(e.target.value) || 1)}
            placeholder="Ex: 10"
          />
        </div>

        {/* Horário de Funcionamento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Horário de Funcionamento</Label>
            <Switch
              checked={settings.workingHours.enabled}
              onCheckedChange={(checked) => handleWorkingHoursChange('enabled', checked)}
            />
          </div>

          {settings.workingHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Horário de Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Horário de Fim</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mensagens Personalizadas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
            <Textarea
              id="welcome-message"
              placeholder="Digite a mensagem de boas-vindas..."
              value={settings.welcomeMessage}
              onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offline-message">Mensagem Fora do Horário</Label>
            <Textarea
              id="offline-message"
              placeholder="Digite a mensagem para fora do horário..."
              value={settings.offlineMessage}
              onChange={(e) => handleSettingChange('offlineMessage', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Idioma */}
        <div className="space-y-2">
          <Label>Idioma do Agente</Label>
          <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
              <SelectItem value="fr-FR">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}