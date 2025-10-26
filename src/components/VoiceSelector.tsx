import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2 } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (value: string) => void;
}

const GOOGLE_VOICES = [
  { value: "pt-BR-Standard-A", label: "Português BR - Feminino A" },
  { value: "pt-BR-Standard-B", label: "Português BR - Masculino B" },
  { value: "pt-BR-Standard-C", label: "Português BR - Feminino C" },
  { value: "pt-BR-Wavenet-A", label: "Português BR - Wavenet Feminino A" },
  { value: "pt-BR-Wavenet-B", label: "Português BR - Wavenet Masculino B" },
  { value: "pt-BR-Neural2-A", label: "Português BR - Neural2 Feminino A" },
  { value: "pt-BR-Neural2-B", label: "Português BR - Neural2 Masculino B" },
];

export function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-accent">
            <Volume2 className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>Voz do Agente</CardTitle>
            <CardDescription>Escolha a voz para transcrição de áudio</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="voice-select">Voz do Google TTS</Label>
          <Select value={selectedVoice} onValueChange={onVoiceChange}>
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Selecione uma voz" />
            </SelectTrigger>
            <SelectContent>
              {GOOGLE_VOICES.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
