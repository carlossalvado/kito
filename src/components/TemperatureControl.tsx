import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Thermometer } from "lucide-react";

interface TemperatureControlProps {
  temperature: number;
  onTemperatureChange: (value: number) => void;
}

export function TemperatureControl({ temperature, onTemperatureChange }: TemperatureControlProps) {
  return (
    <Card className="card-floating">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg gradient-accent">
            <Thermometer className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>Temperatura do Agente</CardTitle>
            <CardDescription>
              Controle a criatividade das respostas (0 = mais focado, 1 = mais criativo)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature-slider">Temperatura</Label>
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              {temperature.toFixed(2)}
            </span>
          </div>
          <Slider
            id="temperature-slider"
            min={0}
            max={1}
            step={0.01}
            value={[temperature]}
            onValueChange={(values) => onTemperatureChange(values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mais Focado</span>
            <span>Mais Criativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
