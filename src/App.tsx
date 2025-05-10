import {useState, useEffect} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ArbeitszeitRechner() {
    const [aktuellerStundenstand, setAktuellerStundenstand] = useState("43:01");
    const [sollarbeitszeit, setSollarbeitszeit] = useState("07:48");

    const [modus, setModus] = useState<"standard" | "waswaerewenn">("standard");

    // Standard-Modus
    const [startzeit, setStartzeit] = useState("06:50");
    const [zielStundenstand, setZielStundenstand] = useState("39:45");
    const [berechneterFeierabend, setBerechneterFeierabend] = useState<string | null>(null);

    // Was-wäre-wenn-Modus
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
        const ziel = aktuell - differenz;

        setBerechneterZielstand(minutenZuZeitString(ziel));
        setZielstandDifferenz(differenz);
    }

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
            <h1 className="text-3xl font-bold text-center mb-6">🕒 Arbeitszeit-Rechner</h1>

            <div className="flex justify-center gap-4 mb-4">
                <Button onClick={() => setModus("standard")} variant={modus === "standard" ? "default" : "outline"}>Feierabend berechnen</Button>
                <Button onClick={() => setModus("waswaerewenn")} variant={modus === "waswaerewenn" ? "default" : "outline"}>Was wäre wenn?</Button>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label>Aktueller Stundenstand</Label>
                        <Input value={aktuellerStundenstand} onChange={e => setAktuellerStundenstand(e.target.value)} placeholder="z.B. 43:01" />
                    </div>
                    <div className="space-y-2">
                        <Label>Reguläre Tagesarbeitszeit</Label>
                        <Input value={sollarbeitszeit} onChange={e => setSollarbeitszeit(e.target.value)} placeholder="z.B. 07:48" />
                    </div>
                </CardContent>
            </Card>

            {modus === "standard" ? (
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <h2 className="text-xl font-semibold">Feierabend berechnen</h2>
                        <div className="space-y-2">
                            <Label>Startzeit</Label>
                            <Input type="time" value={startzeit} onChange={e => setStartzeit(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ziel-Stundenstand</Label>
                            <Input value={zielStundenstand} onChange={e => setZielStundenstand(e.target.value)} placeholder="z.B. 39:45" />
                        </div>
                        <Button onClick={berechneFeierabendzeit}>Feierabendzeit berechnen</Button>
                        {berechneterFeierabend && (
                            <div className="text-xl font-semibold pt-2">
                                🕓 Du kannst um <span className="text-green-600">{berechneterFeierabend}</span> Feierabend machen.
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <h2 className="text-xl font-semibold">Was wäre wenn</h2>
                        <div className="space-y-2">
                            <Label>Startzeit</Label>
                            <Input type="time" value={wasStartzeit} onChange={e => setWasStartzeit(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Geplante Feierabendzeit</Label>
                            <Input type="time" value={wasFeierabend} onChange={e => setWasFeierabend(e.target.value)} />
                        </div>
                        <Button onClick={berechneZielstundenstand}>Ziel-Stundenstand berechnen</Button>
                        {berechneterZielstand && (
                            <div className="text-xl font-semibold pt-2">
                                📊 Neuer Ziel-Stundenstand wäre: <span className="text-blue-600">{berechneterZielstand}</span>
                            </div>
                        )}
                        {zielstandDifferenz !== null && (
                            <motion.div
                                className={`h-4 rounded-full w-full mt-4`}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5 }}
                                style={{ backgroundColor: zielstandDifferenz === 0 ? "#D1D5DB" : zielstandDifferenz > 0 ? "#4ADE80" : "#F87171" }}
                            />
                        )}
                        {zielstandDifferenz !== null && (
                            <p className="text-sm mt-1 text-center">
                                {zielstandDifferenz > 0 ? `➕ ${minutenZuZeitString(zielstandDifferenz)} Überzeit` : zielstandDifferenz < 0 ? `➖ ${minutenZuZeitString(zielstandDifferenz)} Unterzeit` : "Keine Abweichung"}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
