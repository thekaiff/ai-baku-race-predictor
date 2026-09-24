// Editorial approximations of each 2026 team's livery color, used only as
// a thin accent border per driver row (docs/design/ui-direction.md).
// Sourced from public livery-reveal coverage, not official brand
// guidelines — fine for a UI accent, not for anything brand-official.
const TEAM_ACCENT: Record<string, string> = {
  Mercedes: "#00A19C",
  "Red Bull": "#2456B0",
  McLaren: "#FF8000",
  Ferrari: "#E8002D",
  "Aston Martin": "#00594F",
  "Alpine F1 Team": "#E91E8C",
  Williams: "#00A3E0",
  "RB F1 Team": "#6692FF",
  "Haas F1 Team": "#9C9FA2",
  Audi: "#BB0A30",
  "Cadillac F1 Team": "#111111",
};

export function teamAccent(team: string): string {
  return TEAM_ACCENT[team] ?? "#8A8580";
}
