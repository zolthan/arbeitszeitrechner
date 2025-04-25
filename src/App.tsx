import {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export default function ArbeitszeitRechner() {
    const [startzeit, setStartzeit] = useState("06:50");
    const [zielStundenstand, setZielStundenstand] = useState("39:45");
    const [aktuellerStundenstand, setAktuellerStundenstand] = useState("43:01");
    const [sollarbeitszeit, setSollarbeitszeit] = useState("07:48");
    const [ergebnis, setErgebnis] = useState<string | null>(null);
    const [rechenweg, setRechenweg] = useState<string | null>(null);

    function zeitStringZuMinuten(zeit: string): number {
        const [h, m] = zeit.split(/[:.]/).map(Number);
        return h * 60 + m;
    }

    function minutenZuZeitString(min: number): string {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }

    function berechneFeierabend() {
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

        const feierabend = minutenZuZeitString(feierabendMinuten);
        setErgebnis(feierabend);

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
    }

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label>Startzeit</Label>
                        <Input type="time" value={startzeit} onChange={e => setStartzeit(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Aktueller Stundenstand</Label>
                        <Input value={aktuellerStundenstand} onChange={e => setAktuellerStundenstand(e.target.value)}
                               placeholder="z.B. 43:01"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Ziel-Stundenstand</Label>
                        <Input value={zielStundenstand} onChange={e => setZielStundenstand(e.target.value)}
                               placeholder="z.B. 39:45"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Reguläre Tagesarbeitszeit</Label>
                        <Input value={sollarbeitszeit} onChange={e => setSollarbeitszeit(e.target.value)}
                               placeholder="z.B. 07:48"/>
                    </div>
                    <Button onClick={berechneFeierabend}>Feierabendzeit berechnen</Button>
                    {ergebnis && (
                        <div className="text-xl font-semibold pt-2">
                            🕓 Du kannst um <span className="text-green-600">{ergebnis}</span> Feierabend machen.
                        </div>
                    )}
                    {rechenweg && (
                        <pre
                            className="bg-gray-100 text-sm p-3 rounded whitespace-pre-wrap mt-4 border border-gray-300">
                            {rechenweg}
                        </pre>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}