import { Button } from "@/components/ui/button";

export default function ModusUmschalter({ modus, setModus }: { modus: string; setModus: (m: "standard" | "zielBerechnen") => void }) {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <Button onClick={() => setModus("standard")} variant={modus === "standard" ? "default" : "outline"}>Feierabend berechnen</Button>
      <Button onClick={() => setModus("zielBerechnen")} variant={modus === "zielBerechnen" ? "default" : "outline"}>Ziel-Stundenstand berechnen</Button>
    </div>
  );
}
