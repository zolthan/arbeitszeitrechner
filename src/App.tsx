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

    function zeitStringZuMinuten(zeit: string): number {
        const [h, m] = zeit.split(/[:.]/).map(Number);
        return h * 60 + m;
    }

    function berechneFeierabend() {
        const start = zeitStringZuMinuten(startzeit);
        const soll = zeitStringZuMinuten(sollarbeitszeit);
        const aktuell = zeitStringZuMinuten(aktuellerStundenstand);
        const ziel = zeitStringZuMinuten(zielStundenstand);

        const differenz = aktuell - ziel;
        const arbeitszeitHeute = soll - differenz;

        let pause = 0;
        if (arbeitszeitHeute > 6 * 60) pause = 30;
        if (arbeitszeitHeute > 9 * 60) pause = 45;

        const feierabendMinuten = start + arbeitszeitHeute + pause;

        const stunden = Math.floor(feierabendMinuten / 60);
        const minuten = feierabendMinuten % 60;
        setErgebnis(`${stunden.toString().padStart(2, "0")}:${minuten.toString().padStart(2, "0")}`);
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
                </CardContent>
            </Card>
        </div>
    );
}
