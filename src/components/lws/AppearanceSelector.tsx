import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Appearance } from "@/hooks/use-theme";

const options: { value: Appearance; label: string; description: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", description: "Use the bright LWS appearance.", icon: Sun },
  { value: "dark", label: "Dark", description: "A comfortable dark appearance.", icon: Moon },
  { value: "auto", label: "Auto", description: "Match your device's appearance automatically.", icon: Monitor },
];

export function AppearanceSelector() {
  const { appearance, setAppearance, error } = useTheme();
  return <div>
    <div role="radiogroup" aria-label="Appearance" className="grid grid-cols-3 gap-2 sm:gap-3">
      {options.map(({ value, label, description, icon: Icon }) => <Button key={value} role="radio" aria-checked={appearance === value} title={description} variant="outline" onClick={() => setAppearance(value)} className={`h-auto min-w-0 flex-col gap-2 whitespace-normal p-2 sm:p-3 ${appearance === value ? "border-primary bg-primary-soft ring-1 ring-primary" : "bg-card"}`}>
        <span aria-hidden="true" className={`theme-preview theme-preview-${value}`}><span className="preview-rail" /><span className="preview-lines"><i /><i /><i /></span></span>
        <span className="flex items-center gap-1 text-sm"><Icon className="h-4 w-4" />{label}{appearance === value && <Check className="h-3 w-3" />}</span>
      </Button>)}
    </div>
    <p className="mt-3 text-sm text-muted-foreground">{options.find((option) => option.value === appearance)?.description}</p>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </div>;
}