import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from "lucide-react";

interface PromptConfigProps {
  prompts: {
    required: string;
    optional1: string;
    optional2: string;
    optional3: string;
    optional4: string;
  };
  onPromptChange: (field: string, value: string) => void;
}

export function PromptConfig({ prompts, onPromptChange }: PromptConfigProps) {
  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Configuração do Prompt</CardTitle>
            <CardDescription>
              Defina o comportamento do agente (1 obrigatório + 4 opcionais)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt-required" className="text-destructive">
            Prompt Principal (Obrigatório) *
          </Label>
          <Textarea
            id="prompt-required"
            placeholder="Ex: Você é um assistente virtual que atende clientes no WhatsApp..."
            value={prompts.required}
            onChange={(e) => onPromptChange("required", e.target.value)}
            className="min-h-[100px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt-optional1">Contexto Adicional 1 (Opcional)</Label>
          <Textarea
            id="prompt-optional1"
            placeholder="Ex: Informações sobre produtos e serviços..."
            value={prompts.optional1}
            onChange={(e) => onPromptChange("optional1", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt-optional2">Contexto Adicional 2 (Opcional)</Label>
          <Textarea
            id="prompt-optional2"
            placeholder="Ex: Tom de voz e personalidade..."
            value={prompts.optional2}
            onChange={(e) => onPromptChange("optional2", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt-optional3">Contexto Adicional 3 (Opcional)</Label>
          <Textarea
            id="prompt-optional3"
            placeholder="Ex: Horários de atendimento e políticas..."
            value={prompts.optional3}
            onChange={(e) => onPromptChange("optional3", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt-optional4">Contexto Adicional 4 (Opcional)</Label>
          <Textarea
            id="prompt-optional4"
            placeholder="Ex: Casos de uso específicos e exemplos..."
            value={prompts.optional4}
            onChange={(e) => onPromptChange("optional4", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
