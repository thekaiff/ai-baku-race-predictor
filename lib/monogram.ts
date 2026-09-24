// Legal, original alternative to driver photography (no licensed images
// in this repo — see docs/design/ui-direction.md). Two-letter monogram
// from first + last name, used as the driver's visual identity mark.

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Splits a full name into everything-but-last (small, e.g. "Andrea
// Kimi") and the last token (large/bold, e.g. "Antonelli") — matches the
// reference card typography treatment.
export function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: "", last: fullName };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}
