// Optional per-driver photo hook. Empty by default — this repo ships no
// photography (see docs/design/ui-direction.md: no licensed imagery).
//
// To add your own legally-sourced photos:
//   1. Drop image files in /public/drivers/<driver_id>.jpg
//      (driver_id matches the API's driver_id, e.g. "antonelli", "leclerc")
//   2. Add the entry below: antonelli: "/drivers/antonelli.jpg"
// DriverCard falls back to the monogram automatically if a driver has no
// entry here, so partial coverage is fine.
export const DRIVER_PHOTOS: Record<string, string> = {
  antonelli: "/drivers/antonelli.png",
  albon: "/drivers/albon.png",
  arvid_lindblad: "/drivers/arvid_lindblad.png",
  sainz: "/drivers/sainz.png",
  leclerc: "/drivers/leclerc.png",
  ocon: "/drivers/ocon.png",
  alonso: "/drivers/alonso.png",
  colapinto: "/drivers/colapinto.png",
  bortoleto: "/drivers/bortoleto.png",
  russell: "/drivers/russell.png",
  stroll: "/drivers/stroll.png",
  norris: "/drivers/norris.png",
  hamilton: "/drivers/hamilton.png",
  lawson: "/drivers/lawson.png",
  max_verstappen: "/drivers/max_verstappen.png",
  hulkenberg: "/drivers/hulkenberg.png",
  piastri: "/drivers/piastri.png",
  bearman: "/drivers/bearman.png",
  gasly: "/drivers/gasly.png",
  perez: "/drivers/perez.png",
  bottas: "/drivers/bottas.png",
  tsunoda: "/drivers/tsunoda.png",
};

export function driverPhoto(driverId: string): string | undefined {
  return DRIVER_PHOTOS[driverId];
}
