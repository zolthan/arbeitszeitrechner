import Zeitfeld from "@/components/Zeitfeld";
import { Button } from "@/components/ui/button";
import { zeitStringZuMinuten, minutenZuZeitString } from "@/lib/zeit";

export default function FeierabendRechner({
  startzeit, setStartzeit,
  zielStundenstand, setZielStundenstand,
  aktuellerStundenstand,
  sollarbeitszeit,
  setErgebnis,
  setRechenweg
}: {
  startzeit: string;
  setStartzeit: (v: string) => void;
  zielStundenstand: string;
  setZielStundenstand: (v: string) => void;
  aktuellerStundenstand: string;
  sollarbeitszeit: string;
  setErgebnis: (val: string) => void;
  setRechenweg: (val: string) => void;
}) {
  function berechne() {
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
    setErgebnis(minutenZuZeitString(feierabendMin));

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

  return (
    <>
      <Zeitfeld label="Startzeit" value={startzeit} setValue={setStartzeit} />
      <Zeitfeld label="Ziel-Stundenstand" value={zielStundenstand} setValue={setZielStundenstand} />
      <Button onClick={berechne}>Feierabendzeit berechnen</Button>
    </>
  );
}
