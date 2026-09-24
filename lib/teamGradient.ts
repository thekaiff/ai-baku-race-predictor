// Per-team card gradients — bright team-color top-left fading to near-
// black, matching the reference card style. Hand-picked stops (not
// derived from teamAccent.ts's flat accent) for more control over the
// "premium jewel-tone" look than a generic light/dark blend would give.

const TEAM_GRADIENT: Record<string, { from: string; to: string }> = {
  Mercedes: { from: "#1ED6C4", to: "#0a1f1c" },
  "Red Bull": { from: "#3B6FD9", to: "#0a0f1f" },
  McLaren: { from: "#FFA733", to: "#241200" },
  Ferrari: { from: "#FF2D3D", to: "#240406" },
  "Aston Martin": { from: "#00A388", to: "#001a15" },
  "Alpine F1 Team": { from: "#FF4FB0", to: "#1a0512" },
  Williams: { from: "#29C1F2", to: "#041824" },
  "RB F1 Team": { from: "#7FA6FF", to: "#0a0f24" },
  "Haas F1 Team": { from: "#C7CBCF", to: "#1a1a1a" },
  Audi: { from: "#FF3355", to: "#1a0508" },
  "Cadillac F1 Team": { from: "#4a4a4a", to: "#0a0a0a" },
};

export function teamGradient(team: string): string {
  const g = TEAM_GRADIENT[team] ?? { from: "#8A8580", to: "#141414" };
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 75%)`;
}
