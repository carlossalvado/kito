import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiKeysCard } from "@/components/ApiKeysCard";
import { VoiceSelector } from "@/components/VoiceSelector";
import { PromptConfig } from "@/components/PromptConfig";
import { TemperatureControl } from "@/components/TemperatureControl";
import { Button } from "@/components/ui/button";
import { Bot, Save, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [whatsappToken, setWhatsappToken] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("pt-BR-Standard-A");
  const [temperature, setTemperature] = useState(0.7);
  const [prompts, setPrompts] = useState({
    required: "",
    optional1: "",
    optional2: "",
    optional3: "",
    optional4: "",
  });

  const handlePromptChange = (field: string, value: string) => {
    setPrompts((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!prompts.required.trim()) {
      toast({
        title: "Erro",
        description: "O prompt principal é obrigatório!",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuração salva!",
      description: "As configurações do agente foram salvas com sucesso.",
    });
  };

  const handleTest = () => {
    if (!whatsappToken || !geminiKey || !prompts.required.trim()) {
      toast({
        title: "Configuração incompleta",
        description: "Preencha as chaves de API e o prompt principal antes de testar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Iniciando teste...",
      description: "O agente de IA está sendo configurado para testes.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-hero shadow-glow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WhatsApp AI Agent
            </h1>
              <p className="text-sm text-muted-foreground">
                Configure seu assistente inteligente
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-float">
            <div className="h-2 w-2 rounded-full bg-primary animate-glow" />
            <span className="text-sm font-medium text-primary">
              Modo de Teste Ativo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Configure Seu Agente de{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie um assistente personalizado que atende seus clientes no WhatsApp
            com interpretação de texto e voz
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 max-w-6xl mx-auto">
          {/* API Keys */}
          <ApiKeysCard
            whatsappToken={whatsappToken}
            geminiKey={geminiKey}
            onWhatsappTokenChange={setWhatsappToken}
            onGeminiKeyChange={setGeminiKey}
          />

          {/* Voice and Temperature */}
          <div className="grid md:grid-cols-2 gap-6">
            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
            />
            <TemperatureControl
              temperature={temperature}
              onTemperatureChange={setTemperature}
            />
          </div>

          {/* Prompt Configuration */}
          <PromptConfig prompts={prompts} onPromptChange={handlePromptChange} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleSave}
              size="lg"
              className="gradient-primary text-primary-foreground shadow-lg hover:shadow-glow min-w-[200px]"
            >
              <Save className="mr-2 h-5 w-5" />
              Salvar Configuração
            </Button>
            <Button
              onClick={handleTest}
              size="lg"
              variant="outline"
              className="min-w-[200px] border-2"
            >
              <Play className="mr-2 h-5 w-5" />
              Testar Agente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Desenvolvido com <span className="text-destructive">♥</span> para
            automatizar seu atendimento no WhatsApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
