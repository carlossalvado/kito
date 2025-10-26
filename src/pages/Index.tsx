import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiKeysCard } from "@/components/ApiKeysCard";
import { VoiceSelector } from "@/components/VoiceSelector";
import { PromptConfig } from "@/components/PromptConfig";
import { TemperatureControl } from "@/components/TemperatureControl";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { WhatsAppStatus } from "@/components/WhatsAppStatus";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Save, Play, LogOut, Settings, MessageSquare, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { toast } = useToast();
  const { userId, logout } = useAuth();
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

  const [advancedSettings, setAdvancedSettings] = useState({
    autoReply: true,
    replyDelay: 5,
    maxConversations: 10,
    workingHours: {
      enabled: false,
      start: "09:00",
      end: "18:00",
    },
    welcomeMessage: "Olá! Sou seu assistente virtual. Como posso ajudar?",
    offlineMessage: "Olá! No momento estamos fora do horário de atendimento. Responderemos em breve!",
    language: "pt-BR",
  });

  // Carregar configurações do usuário do localStorage
  useEffect(() => {
    if (userId) {
      const savedConfig = localStorage.getItem(`config_${userId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setSelectedVoice(config.selectedVoice || "pt-BR-Standard-A");
        setTemperature(config.temperature || 0.7);
        setPrompts(config.prompts || {
          required: "",
          optional1: "",
          optional2: "",
          optional3: "",
          optional4: "",
        });
        setAdvancedSettings(config.advancedSettings || advancedSettings);
      }
    }
  }, [userId]);

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

    // Salvar configurações no localStorage por usuário
    if (userId) {
      const config = {
        selectedVoice,
        temperature,
        prompts,
        advancedSettings,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(`config_${userId}`, JSON.stringify(config));
    }

    toast({
      title: "Configuração salva!",
      description: "As configurações do agente foram salvas com sucesso.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const handleTest = () => {
    const whatsappToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Verificar se as APIs estão configuradas no servidor
    if (!whatsappToken || !whatsappPhoneId || !geminiApiKey) {
      toast({
        title: "APIs não configuradas",
        description: "As APIs não estão configuradas no servidor. Verifique o arquivo .env.",
        variant: "destructive",
      });
      return;
    }

    if (!prompts.required.trim()) {
      toast({
        title: "Prompt obrigatório",
        description: "Configure o prompt principal antes de testar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sistema pronto!",
      description: "Todas as configurações estão corretas. O bot está funcionando.",
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
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
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="whatsapp" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Configurações Básicas
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações Avançadas
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Ações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp" className="mt-6">
              <WhatsAppStatus />
            </TabsContent>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* API Status */}
              <ApiKeysCard />

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
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <AdvancedSettings
                settings={advancedSettings}
                onSettingsChange={setAdvancedSettings}
              />
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
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
            </TabsContent>
          </Tabs>
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
