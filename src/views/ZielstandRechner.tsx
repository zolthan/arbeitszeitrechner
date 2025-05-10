import Zeitfeld from "@/components/Zeitfeld";
import { Button } from "@/components/ui/button";
import { zeitStringZuMinuten, minutenZuZeitString } from "@/lib/zeit";

export default function ZielstandRechner({
  start, setStart,
  ende, setEnde,
  aktuellerStundenstand,
  sollarbeitszeit,
  setZielstand,
  setDiff,
  setRechenweg
}: {
  start: string;
  setStart: (v: string) => void;
  ende: string;
  setEnde: (v: string) => void;
  aktuellerStundenstand: string;
  sollarbeitszeit: string;
  setZielstand: (val: string) => void;
  setDiff: (val: number) => void;
  setRechenweg: (val: string) => void;
}) {
  function berechne() {
    const aktuell = zeitStringZuMinuten(aktuellerStundenstand);
    const soll = zeitStringZuMinuten(sollarbeitszeit);
    const startMin = zeitStringZuMinuten(start);
    const endeMin = zeitStringZuMinuten(ende);
    const brutto = endeMin - startMin;

    let pause = 0;
    if (brutto > 9 * 60) pause = 45;
    else if (brutto > 6 * 60) pause = 30;

    const netto = brutto - pause;
    const differenz = netto - soll;
    const ziel = aktuell + differenz;

    setZielstand(minutenZuZeitString(ziel));
    setDiff(differenz);

    const rechnung = [
      `Aktueller Stundenstand: ${minutenZuZeitString(aktuell)} Minuten`,
      `Geplante Startzeit: ${start}`,
      `Geplante Feierabendzeit: ${ende}`,
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
    <>
      <Zeitfeld label="Startzeit" value={start} setValue={setStart} />
      <Zeitfeld label="Geplante Feierabendzeit" value={ende} setValue={setEnde} />
      <Button onClick={berechne}>Ziel-Stundenstand berechnen</Button>
    </>
  );
}
