import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

function normalisiereZeitEingabe(eingabe: string): string {
  if (eingabe.includes(":")) return eingabe;
  if (/^\d{1,2}$/.test(eingabe)) return eingabe.padStart(2, "0") + ":00";
  if (/^\d{3,4}$/.test(eingabe)) {
    const teile = eingabe.padStart(4, "0").match(/(\d{2})(\d{2})/);
    if (teile) return `${teile[1]}:${teile[2]}`;
  }
  return eingabe;
}

function Zeitfeld({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  const handleBlur = () => {
    const normalisiert = normalisiereZeitEingabe(value);
    setValue(normalisiert);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}

function zeitStringZuMinuten(zeit: string): number {
  const [h, m] = zeit.split(/[:.]/).map(Number);
  return h * 60 + m;
}

function minutenZuZeitString(min: number): string {
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  const prefix = min < 0 ? "-" : "";
  return `${prefix}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function ArbeitszeitRechner() {
  const [aktuellerStundenstand, setAktuellerStundenstand] = useState("43:01");
  const [sollarbeitszeit, setSollarbeitszeit] = useState("07:48");

  const [modus, setModus] = useState<"standard" | "zielBerechnen">("standard");

  const [startzeit, setStartzeit] = useState("06:50");
  const [zielStundenstand, setZielStundenstand] = useState("39:45");
  const [berechneterFeierabend, setBerechneterFeierabend] = useState<string | null>(null);
  const [rechenweg, setRechenweg] = useState<string | null>(null);

  const [wasStartzeit, setWasStartzeit] = useState("06:50");
  const [wasFeierabend, setWasFeierabend] = useState("15:30");
  const [berechneterZielstand, setBerechneterZielstand] = useState<string | null>(null);
  const [zielstandDifferenz, setZielstandDifferenz] = useState<number | null>(null);

  useEffect(() => {
    const gespeicherterStundenstand = localStorage.getItem("stundenstand");
    if (gespeicherterStundenstand) setAktuellerStundenstand(gespeicherterStundenstand);
  }, []);

  useEffect(() => {
    localStorage.setItem("stundenstand", aktuellerStundenstand);
  }, [aktuellerStundenstand]);

  function berechneFeierabendzeit() {
    const aktuell = zeitStringZuMinuten(aktuellerStundenstand);
    const ziel = zeitStringZuMinuten(zielStundenstand);
    const soll = zeitStringZuMinuten(sollarbeitszeit);
    const start = zeitStringZuMinuten(startzeit);

    const differenz = aktuell - ziel;
    const arbeitszeitHeute = soll - differenz;

    let pause = 0;
    if (arbeitszeitHeute > 9 * 60) pause = 45;
    else if (arbeitszeitHeute > 6 * 60) pause = 30;

    const feierabendMin = start + arbeitszeitHeute + pause;
    setBerechneterFeierabend(minutenZuZeitString(feierabendMin));

    const rechnung = [
      `Aktueller Stand: ${minutenZuZeitString(aktuell)} Minuten`,
      `Ziel: ${minutenZuZeitString(ziel)} Minuten`,
      `Differenz: ${differenz} Minuten`,
      `Reguläre Tagesarbeitszeit: ${minutenZuZeitString(soll)} Minuten`,
      `Netto-Arbeitszeit heute: ${arbeitszeitHeute} Minuten`,
      `Pausenregelung angewendet: ${pause} Minuten`,
      `Startzeit: ${startzeit}`,
      `Feierabendzeit: ${minutenZuZeitString(feierabendMin)}`
    ];

    setRechenweg(rechnung.join("\n"));
  }

  function berechneZielstundenstand() {
    const aktuell = zeitStringZuMinuten(aktuellerStundenstand);
    const soll = zeitStringZuMinuten(sollarbeitszeit);
    const start = zeitStringZuMinuten(wasStartzeit);
    const ende = zeitStringZuMinuten(wasFeierabend);

    const brutto = ende - start;

    let pause = 0;
    if (brutto > 9 * 60) pause = 45;
    else if (brutto > 6 * 60) pause = 30;

    const netto = brutto - pause;
    const differenz = netto - soll;
    const ziel = aktuell + differenz;

    setBerechneterZielstand(minutenZuZeitString(ziel));
    setZielstandDifferenz(differenz);

    const rechnung = [
      `Aktueller Stundenstand: ${minutenZuZeitString(aktuell)} Minuten`,
      `Geplante Startzeit: ${wasStartzeit}`,
      `Geplante Feierabendzeit: ${wasFeierabend}`,
      `Bruttoarbeitszeit: ${brutto} Minuten`,
      `Pausenregel: ${pause} Minuten`,
      `Nettoarbeitszeit: ${netto} Minuten`,
      `Reguläre Tagesarbeitszeit: ${minutenZuZeitString(soll)} Minuten`,
      `Differenz: ${minutenZuZeitString(differenz)} Minuten`,
      `Neuer Ziel-Stundenstand: ${minutenZuZeitString(ziel)} Minuten`
    ];

    setRechenweg(rechnung.join("\n"));
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🕒 Arbeitszeit-Rechner</h1>

      <div className="flex justify-center gap-4 mb-4">
        <Button onClick={() => setModus("standard")} variant={modus === "standard" ? "default" : "outline"}>Feierabend berechnen</Button>
        <Button onClick={() => setModus("zielBerechnen")} variant={modus === "zielBerechnen" ? "default" : "outline"}>Ziel-Stundenstand berechnen</Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Zeitfeld label="Aktueller Stundenstand" value={aktuellerStundenstand} setValue={setAktuellerStundenstand} />
          <Zeitfeld label="Reguläre Tagesarbeitszeit" value={sollarbeitszeit} setValue={setSollarbeitszeit} />
        </CardContent>
      </Card>

      {modus === "standard" ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Feierabend berechnen</h2>
            <Zeitfeld label="Startzeit" value={startzeit} setValue={setStartzeit} />
            <Zeitfeld label="Ziel-Stundenstand" value={zielStundenstand} setValue={setZielStundenstand} />
            <Button onClick={berechneFeierabendzeit}>Feierabendzeit berechnen</Button>
            {berechneterFeierabend && (
              <div className="text-xl font-semibold pt-2">
                🕓 Du kannst um <span className="text-green-600">{berechneterFeierabend}</span> Feierabend machen.
              </div>
            )}
            {rechenweg && (
              <pre className="bg-gray-100 text-sm p-3 rounded whitespace-pre-wrap mt-4 border border-gray-300">
                {rechenweg}
              </pre>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Ziel-Stundenstand berechnen</h2>
            <Zeitfeld label="Startzeit" value={wasStartzeit} setValue={setWasStartzeit} />
            <Zeitfeld label="Geplante Feierabendzeit" value={wasFeierabend} setValue={setWasFeierabend} />
            <Button onClick={berechneZielstundenstand}>Ziel-Stundenstand berechnen</Button>
            {berechneterZielstand && (
              <div className="text-xl font-semibold pt-2">
                📊 Neuer Ziel-Stundenstand wäre: <span className="text-blue-600">{berechneterZielstand}</span>
              </div>
            )}
            {zielstandDifferenz !== null && (
              <>
                <motion.div
                  className="h-4 rounded-full w-full mt-4"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{
                    backgroundColor:
                      zielstandDifferenz === 0
                        ? "#D1D5DB"
                        : zielstandDifferenz > 0
                        ? "#4ADE80"
                        : "#F87171"
                  }}
                />
                <p className="text-sm mt-1 text-center">
                  {zielstandDifferenz > 0
                    ? `➕ ${minutenZuZeitString(zielstandDifferenz)} Überzeit`
                    : zielstandDifferenz < 0
                    ? `➖ ${minutenZuZeitString(zielstandDifferenz)} Unterzeit`
                    : "Keine Abweichung"}
                </p>
              </>
            )}
            {rechenweg && (
              <pre className="bg-gray-100 text-sm p-3 rounded whitespace-pre-wrap mt-4 border border-gray-300">
                {rechenweg}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}