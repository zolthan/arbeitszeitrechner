import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Zeitfeld from "@/components/Zeitfeld";
import ModusUmschalter from "@/components/ModusUmschalter";
import FeierabendRechner from "@/views/FeierabendRechner";
import ZielstandRechner from "@/views/ZielstandRechner";
import { motion } from "framer-motion";

export default function App() {
  const [aktuellerStundenstand, setAktuellerStundenstand] = useState("40:00");
  const [sollarbeitszeit, setSollarbeitszeit] = useState("07:48");
  const [modus, setModus] = useState<"standard" | "zielBerechnen">("standard");

  const [rechenweg, setRechenweg] = useState<string | null>(null);

  // Standard-Modus
  const [startzeit, setStartzeit] = useState("06:50");
  const [zielStundenstand, setZielStundenstand] = useState("40:00");
  const [berechneterFeierabend, setBerechneterFeierabend] = useState<string | null>(null);

  // Ziel-Modus
  const [wasStartzeit, setWasStartzeit] = useState("06:50");
  const [wasFeierabend, setWasFeierabend] = useState("15:30");
  const [berechneterZielstand, setBerechneterZielstand] = useState<string | null>(null);
  const [zielstandDifferenz, setZielstandDifferenz] = useState<number | null>(null);

  useEffect(() => {
    const gespeichert = localStorage.getItem("stundenstand");
    if (gespeichert) setAktuellerStundenstand(gespeichert);
  }, []);

  useEffect(() => {
    localStorage.setItem("stundenstand", aktuellerStundenstand);
  }, [aktuellerStundenstand]);

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🕒 Arbeitszeit-Rechner</h1>

      <ModusUmschalter modus={modus} setModus={setModus} />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Zeitfeld label="Aktueller Stundenstand" value={aktuellerStundenstand} setValue={setAktuellerStundenstand} />
          <Zeitfeld label="Reguläre Tagesarbeitszeit" value={sollarbeitszeit} setValue={setSollarbeitszeit} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {modus === "standard" ? (
            <>
              <h2 className="text-xl font-semibold">Feierabend berechnen</h2>
              <FeierabendRechner
                startzeit={startzeit}
                setStartzeit={setStartzeit}
                zielStundenstand={zielStundenstand}
                setZielStundenstand={setZielStundenstand}
                aktuellerStundenstand={aktuellerStundenstand}
                sollarbeitszeit={sollarbeitszeit}
                setErgebnis={setBerechneterFeierabend}
                setRechenweg={setRechenweg}
              />
              {berechneterFeierabend && (
                <div className="text-xl font-semibold pt-2">
                  🕓 Du kannst um <span className="text-green-600">{berechneterFeierabend}</span> Feierabend machen.
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Ziel-Stundenstand berechnen</h2>
              <ZielstandRechner
                start={wasStartzeit}
                setStart={setWasStartzeit}
                ende={wasFeierabend}
                setEnde={setWasFeierabend}
                aktuellerStundenstand={aktuellerStundenstand}
                sollarbeitszeit={sollarbeitszeit}
                setZielstand={setBerechneterZielstand}
                setDiff={setZielstandDifferenz}
                setRechenweg={setRechenweg}
              />
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
                      ? `➕ ${zielstandDifferenz} Minuten Überzeit`
                      : zielstandDifferenz < 0
                      ? `➖ ${zielstandDifferenz} Minuten Unterzeit`
                      : "Keine Abweichung"}
                  </p>
                </>
              )}
            </>
          )}

          {rechenweg && (
            <pre className="bg-gray-100 text-sm p-3 rounded whitespace-pre-wrap mt-4 border border-gray-300">
              {rechenweg}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}