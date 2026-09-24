

export function TrackOutline({
  className,
  style,
  accentColor,
}: {
  className?: string;
  style?: React.CSSProperties;
  accentColor?: string;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 640 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40,220 L560,220 L560,140 L500,140 L500,180 L460,180 L460,120
           L420,120 L420,160 L380,160 L380,100 L340,100 L340,60 L40,60 Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {accentColor && (
        <>
          {/* highlight the main straight — the circuit's signature feature */}
          <path
            d="M340,60 L40,60"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="40" cy="60" r="7" fill={accentColor} />
          <circle cx="40" cy="220" r="4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export function CarSilhouette({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* front wing */}
      <rect x="4" y="40" width="22" height="6" rx="2" fill="currentColor" />
      {/* nose + body */}
      <path
        d="M26,43 L60,38 L150,38 Q168,38 172,46 L172,50 Q168,58 150,58
           L60,58 L26,53 Z"
        fill="currentColor"
      />
      {/* halo */}
      <path
        d="M95,38 Q108,18 122,38"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* rear wing */}
      <rect x="172" y="30" width="6" height="30" rx="2" fill="currentColor" />
      <rect x="172" y="28" width="18" height="6" rx="2" fill="currentColor" />
      {/* wheels */}
      <rect x="44" y="24" width="14" height="20" rx="4" fill="currentColor" />
      <rect x="44" y="52" width="14" height="20" rx="4" fill="currentColor" />
      <rect x="140" y="22" width="16" height="22" rx="4" fill="currentColor" />
      <rect x="140" y="52" width="16" height="22" rx="4" fill="currentColor" />
    </svg>
  );
}

export function CheckeredStrip({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 8"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="checker"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="4" height="4" fill="currentColor" />
          <rect x="4" y="4" width="4" height="4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="64" height="8" fill="url(#checker)" />
    </svg>
  );
}

// Minimal line-icon set for the circuit stat row — original, generic
// glyphs, not any brand's icon set.

export function IconRuler({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 16L16 3l5 5L8 21z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11l2 2M11 8l2 2M14 5l2 2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 21V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 4h14l-3.5 4L19 12H5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRoute({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.5 7.5C9 10 6 14 10 15.5C13 16.6 15 15 17 16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

export function IconStopwatch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 13V9M9 3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
