

"use client";

import { useState } from "react";
import type { GatedDriverScore } from "@/lib/types";
import DriverRow from "./DriverRow";

export default function DriverRankings({
  drivers,
}: {
  drivers: GatedDriverScore[];
}) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...drivers].sort((a, b) => {
    if (a.eligible && b.eligible) return (a.rank ?? 0) - (b.rank ?? 0);
    if (a.eligible) return -1;
    if (b.eligible) return 1;
    return 0;
  });

  const visible = showAll ? sorted : sorted.slice(0, 5);

  return (
    <section className="rankings">
      <h2 className="rankings__title">Rankings</h2>
      <ul className="rankings__stack">
        {visible.map((d) => (
          <DriverRow key={d.driver_id} driver={d} />
        ))}
      </ul>
      {drivers.length > 5 && (
        <button
          type="button"
          className="rankings__toggle"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show top 5" : "Show all drivers"}
        </button>
      )}
    </section>
  );
}
