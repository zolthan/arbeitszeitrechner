import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalisiereZeitEingabe } from "@/lib/zeit";

export default function Zeitfeld({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  const handleBlur = () => {
    const normalisiert = normalisiereZeitEingabe(value);
    setValue(normalisiert);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={e => setValue(e.target.value)} onBlur={handleBlur} />
    </div>
  );
}
