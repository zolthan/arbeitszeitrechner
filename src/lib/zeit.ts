export function normalisiereZeitEingabe(eingabe: string): string {
  if (eingabe.includes(":")) return eingabe;
  if (/^\d{1,2}$/.test(eingabe)) return eingabe.padStart(2, "0") + ":00";
  if (/^\d{3,4}$/.test(eingabe)) {
    const teile = eingabe.padStart(4, "0").match(/(\d{2})(\d{2})/);
    if (teile) return `${teile[1]}:${teile[2]}`;
  }
  return eingabe;
}

export function zeitStringZuMinuten(zeit: string): number {
  const [h, m] = zeit.split(/[:.]/).map(Number);
  return h * 60 + m;
}

export function minutenZuZeitString(min: number): string {
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  const prefix = min < 0 ? "-" : "";
  return `${prefix}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
