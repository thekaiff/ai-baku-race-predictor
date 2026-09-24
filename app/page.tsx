
"use client";

import { useEffect, useState } from "react";
import TopPick from "@/components/TopPick";
import DriverRankings from "@/components/DriverRankings";
import CircuitFacts from "@/components/CircuitFacts";
import ScenarioLab from "@/components/ScenarioLab";
import LoadingState from "@/components/LoadingState";
import ErrorBanner from "@/components/ErrorBanner";
import StickyHeader from "@/components/StickyHeader";
import {
  TrackOutline,
  CheckeredStrip,
  IconRuler,
  IconFlag,
  IconRoute,
  IconStopwatch,
} from "@/components/motifs";
import { fetchPredictions } from "@/lib/api";
import type { PredictionsResponse } from "@/lib/types";

const CIRCUIT_FACTS = {
  length: "6.003 km",
  laps: "51",
  raceDistance: "306.049 km",
  lapRecord: "1:43.009",
  lapRecordHolder: "Leclerc, 2019",
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function DashboardPage() {
  const [data, setData] = useState<PredictionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPredictions()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Request failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return (
      <main className="page page--error">
        <p className="page__error-title">Predictions unavailable</p>
        <p className="page__error-message">{error}</p>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const topPick = data.drivers.find((d) => d.rank === 1) ?? data.drivers[0];

  return (
    <>
      <StickyHeader topPick={topPick} />

      <main className="page">
        {error && <ErrorBanner message={error} />}

        <header className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <div className="hero__overlay" aria-hidden="true" />
          <TrackOutline className="hero__track" />
          <div className="hero__logo" aria-hidden="true" />
          <p className="hero__eyebrow">Formula 1 · Azerbaijan Grand Prix</p>
          <h1 className="hero__title">BAKU</h1>
          <p className="hero__subtitle">Pre-race predictions</p>

          <dl className="hero__stats">
            <div className="hero__stat">
              <IconRuler className="hero__stat-icon" />
              <div>
                <dt>Circuit Length</dt>
                <dd>{CIRCUIT_FACTS.length}</dd>
              </div>
            </div>
            <div className="hero__stat">
              <IconFlag className="hero__stat-icon" />
              <div>
                <dt>Laps</dt>
                <dd>{CIRCUIT_FACTS.laps}</dd>
              </div>
            </div>
            <div className="hero__stat">
              <IconRoute className="hero__stat-icon" />
              <div>
                <dt>Race Distance</dt>
                <dd>{CIRCUIT_FACTS.raceDistance}</dd>
              </div>
            </div>
            <div className="hero__stat">
              <IconStopwatch className="hero__stat-icon" />
              <div>
                <dt>Lap Record</dt>
                <dd>
                  {CIRCUIT_FACTS.lapRecord}
                  <span className="hero__stats-sub">
                    {CIRCUIT_FACTS.lapRecordHolder}
                  </span>
                </dd>
              </div>
            </div>
          </dl>

          <p className="hero__meta">
            Race day {formatDate(data.race_date)} · Data through{" "}
            {formatDate(data.data_through)}
          </p>
        </header>

        <CheckeredStrip className="checkered-strip" />
        <div id="hero-sentinel" aria-hidden="true" />

        <TopPick driver={topPick} />

        <DriverRankings drivers={data.drivers} />

        <CircuitFacts />

        <ScenarioLab drivers={data.drivers} />

        <p className="disclaimer">
          <span className="disclaimer__label">Model score</span>
          Scores show the model&apos;s relative preference across the
          field, not calibrated chances of winning.
        </p>
      </main>
    </>
  );
}
