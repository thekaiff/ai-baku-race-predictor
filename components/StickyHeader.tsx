

"use client";

import { useEffect, useState } from "react";
import type { GatedDriverScore } from "@/lib/types";
import { teamAccent } from "@/lib/teamAccent";

export default function StickyHeader({
  topPick,
}: {
  topPick: GatedDriverScore;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const pct = (topPick.win_score * 100).toFixed(1);

  return (
    <div
      className={`sticky-header${visible ? " sticky-header--visible" : ""}`}
      style={{ borderBottomColor: teamAccent(topPick.team) }}
    >
      <span className="sticky-header__title">BAKU</span>
      <span className="sticky-header__pick">
        {topPick.driver}
        <strong>{pct}%</strong>
      </span>
    </div>
  );
}
