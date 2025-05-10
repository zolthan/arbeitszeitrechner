import {useState, useEffect} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export default function ArbeitszeitRechner() {
    const [startzeit, setStartzeit] = useState("06:50");
    const [zielStundenstand, setZielStundenstand] = useState("39:45");
    const [aktuellerStundenstand, setAktuellerStundenstand] = useState("43:01");
    const [sollarbeitszeit, setSollarbeitszeit] = useState("07:48");
    const [modus, setModus] = useState<"standard" | "waswaerewenn">("standard");

    const [zeitBis, setZeitBis] = useState("11:22");
    const [rechenweg, setRechenweg] = useState<string | null>(null);

    useEffect(() => {
        const gespeicherteStartzeit = localStorage.getItem("startzeit");
        const gespeicherterStundenstand = localStorage.getItem("stundenstand");
        if (gespeicherteStartzeit) setStartzeit(gespeicherteStartzeit);
        if (gespeicherterStundenstand) setAktuellerStundenstand(gespeicherterStundenstand);
    }, []);

    useEffect(() => {
        localStorage.setItem("startzeit", startzeit);
    }, [startzeit]);

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

    function berechne() {
        const start = zeitStringZuMinuten(startzeit);
        const soll = zeitStringZuMinuten(sollarbeitszeit);
        const aktuell = zeitStringZuMinuten(aktuellerStundenstand);
        const ziel = zeitStringZuMinuten(zielStundenstand);

        const differenz = aktuell - ziel;
        const arbeitszeitHeute = soll - differenz;

        let pause = 0;
        if (arbeitszeitHeute > 9 * 60) pause = 45;
        else if (arbeitszeitHeute > 6 * 60) pause = 30;

        const feierabendMinuten = start + arbeitszeitHeute + pause;

        if (modus === "standard") {
            const feierabend = minutenZuZeitString(feierabendMinuten);
            setZeitBis(feierabend);

            const rechnung = [
                `Aktueller Stand: ${minutenZuZeitString(aktuell)} Minuten`,
                `Ziel: ${minutenZuZeitString(ziel)} Minuten`,
                `Differenz: ${differenz} Minuten`,
                `Reguläre Tagesarbeitszeit: ${minutenZuZeitString(soll)} Minuten`,
                `Netto-Arbeitszeit heute: ${arbeitszeitHeute} Minuten`,
                `Pausenregelung angewendet: ${pause} Minuten`,
                `Startzeit: ${startzeit}`,
                `Feierabendzeit: ${feierabend}`
            ];

            setRechenweg(rechnung.join("\n"));
        } else {
            const ende = zeitStringZuMinuten(zeitBis);
            const brutto = ende - start;

            let pauseWas = 0;
            if (brutto > 9 * 60) pauseWas = 45;
            else if (brutto > 6 * 60) pauseWas = 30;

            const netto = brutto - pauseWas;
            const diff = netto - soll;

            const rechnung = [
                `Aktueller Stand: ${minutenZuZeitString(aktuell)} Minuten`,
                `Ziel: ${minutenZuZeitString(ziel)} Minuten`,
                `Differenz: ${differenz} Minuten`,
                `Reguläre Tagesarbeitszeit: ${minutenZuZeitString(soll)} Minuten`,
                `Geplante Startzeit: ${startzeit}`,
                `Geplantes Ende: ${zeitBis}`,
                `Brutto: ${brutto} Minuten`,
                `Pause laut Regelung: ${pauseWas} Minuten`,
                `Netto: ${netto} Minuten`,
                `→ Überzeit heute: ${minutenZuZeitString(diff)}`
            ];

            setRechenweg(rechnung.join("\n"));
        }
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
                        <Label>Startzeit</Label>
                        <Input type="time" value={startzeit} onChange={e => setStartzeit(e.target.value)} />
                    </div>
                    {modus === "standard" ? (
                        <>
                            <div className="space-y-2">
                                <Label>Aktueller Stundenstand</Label>
                                <Input value={aktuellerStundenstand} onChange={e => setAktuellerStundenstand(e.target.value)} placeholder="z.B. 43:01" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ziel-Stundenstand</Label>
                                <Input value={zielStundenstand} onChange={e => setZielStundenstand(e.target.value)} placeholder="z.B. 39:45" />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Label>Geplante Feierabendzeit</Label>
                            <Input type="time" value={zeitBis} onChange={e => setZeitBis(e.target.value)} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Reguläre Tagesarbeitszeit</Label>
                        <Input value={sollarbeitszeit} onChange={e => setSollarbeitszeit(e.target.value)} placeholder="z.B. 07:48" />
                    </div>
                    <Button onClick={berechne}>{modus === "standard" ? "Feierabendzeit berechnen" : "Überzeit berechnen"}</Button>
                    {zeitBis && modus === "standard" && (
                        <div className="text-xl font-semibold pt-2">
                            🕓 Du kannst um <span className="text-green-600">{zeitBis}</span> Feierabend machen.
                        </div>
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
