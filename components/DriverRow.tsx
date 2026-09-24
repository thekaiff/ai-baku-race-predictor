
"use client";

import type { GatedDriverScore } from "@/lib/types";
import { teamGradient } from "@/lib/teamGradient";
import { splitName } from "@/lib/monogram";
import { driverPhoto } from "@/lib/driverPhotos";
import { useInView } from "@/lib/useInView";

export default function DriverRow({ driver }: { driver: GatedDriverScore }) {
  const gradient = teamGradient(driver.team);
  const pct = (driver.win_score * 100).toFixed(1);
  const photo = driverPhoto(driver.driver_id);
  const { first, last } = splitName(driver.driver);
  const [ref, inView] = useInView<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={[
        "driver-card",
        driver.eligible ? "" : "driver-card--muted",
        inView ? "driver-card--in-view" : "",
      ].join(" ").trim()}
      style={{ backgroundImage: gradient }}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="driver-card__photo" src={photo} alt="" aria-hidden="true" />
      )}

      <div className="driver-card__content">
        <span className="driver-card__rank">
          {driver.eligible ? String(driver.rank).padStart(2, "0") : "—"}
        </span>
        <p className="driver-card__name">
          {first && <span className="driver-card__firstname">{first}</span>}
          <span className="driver-card__lastname">{last}</span>
        </p>
      </div>

      <div className="driver-card__footer">
        <span className="driver-card__team">{driver.team}</span>
        {driver.eligible ? (
          <span className="driver-card__score">{pct}%</span>
        ) : (
          <span className="driver-card__insufficient">Insufficient data</span>
        )}
      </div>
    </li>
  );
}
