

"use client";

import type { GatedDriverScore } from "@/lib/types";
import { teamAccent } from "@/lib/teamAccent";
import { initials } from "@/lib/monogram";
import { useCountUp } from "@/lib/useCountUp";
import { TrackOutline, CarSilhouette } from "./motifs";

export default function TopPick({ driver }: { driver: GatedDriverScore }) {
  const accent = teamAccent(driver.team);
  const animatedScore = useCountUp(driver.win_score * 100);

  return (
    <section className="top-pick" style={{ borderBottomColor: accent }}>
      <TrackOutline className="top-pick__watermark" />
      <div className="top-pick__monogram" style={{ backgroundColor: accent }}>
        {initials(driver.driver)}
      </div>
      <p className="top-pick__label">Model pick</p>
      <p className="top-pick__team">{driver.team}</p>
      <h2 className="top-pick__name">{driver.driver}</h2>
      <p className="top-pick__score">
        {animatedScore.toFixed(1)}
        <span className="top-pick__score-unit">%</span>
      </p>
      <p className="top-pick__score-label">Model score</p>
      <CarSilhouette className="top-pick__car" style={{ color: accent }} />
    </section>
  );
}
