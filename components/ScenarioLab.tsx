

"use client";

import { useState } from "react";
import type { GatedDriverScore, ScenarioResponse } from "@/lib/types";
import { runScenario } from "@/lib/api";

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export default function ScenarioLab({
  drivers,
}: {
  drivers: GatedDriverScore[];
}) {
  const eligibleDrivers = drivers.filter((d) => d.eligible);
  const [driverId, setDriverId] = useState(eligibleDrivers[0]?.driver_id ?? "");
  const selected = drivers.find((d) => d.driver_id === driverId) ?? drivers[0];

  const actualFinish = selected?.driver_finish_5 ?? 11;
  const [sliderValue, setSliderValue] = useState(actualFinish);
  const [result, setResult] = useState<ScenarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDriverChange(id: string) {
    setDriverId(id);
    const next = drivers.find((d) => d.driver_id === id);
    setSliderValue(next?.driver_finish_5 ?? 11);
    setResult(null);
    setError(null);
  }

  function handleReset() {
    setSliderValue(actualFinish);
    setResult(null);
    setError(null);
  }

  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const res = await runScenario(driverId, sliderValue);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scenario request failed");
    } finally {
      setLoading(false);
    }
  }

  if (!selected) return null;

  const change = result ? result.scenario_win_score - result.original_win_score : 0;
  const changeLabel = result
    ? `${change >= 0 ? "+" : ""}${(change * 100).toFixed(1)} pp`
    : "—";

  return (
    <section className="scenario-lab">
      <p className="scenario-lab__eyebrow">What if</p>
      <h2 className="scenario-lab__title">Scenario Lab</h2>
      <p className="scenario-lab__subtitle">
        Explore how changing one input affects the model. Other inputs
        stay fixed.
      </p>

      <div className="scenario-lab__panel">
        <label className="scenario-lab__field">
          <span className="scenario-lab__label">Driver</span>
          <select
            className="scenario-lab__select"
            value={driverId}
            onChange={(e) => handleDriverChange(e.target.value)}
          >
            {eligibleDrivers.map((d) => (
              <option key={d.driver_id} value={d.driver_id}>
                {d.driver} — {d.team}
              </option>
            ))}
          </select>
        </label>

        <div className="scenario-lab__field">
          <div className="scenario-lab__slider-head">
            <span className="scenario-lab__label">
              Assumed recent average finish
            </span>
            <span className="scenario-lab__slider-value">
              {sliderValue.toFixed(1)}
            </span>
          </div>
          <p className="scenario-lab__actual">
            Actual recent average finish: {actualFinish.toFixed(1)}
          </p>
          <input
            type="range"
            min={1}
            max={22}
            step={0.1}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            className="scenario-lab__range"
          />
          <div className="scenario-lab__range-labels">
            <span>1 · Best</span>
            <span>22 · Worst</span>
          </div>
        </div>

        <div className="scenario-lab__actions">
          <button
            type="button"
            className="scenario-lab__run"
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? "Running…" : "Run scenario"}
          </button>
          <button type="button" className="scenario-lab__reset" onClick={handleReset}>
            Reset
          </button>
          {!result && !loading && (
            <span className="scenario-lab__hint">
              Adjust the finish, then run the scenario.
            </span>
          )}
        </div>

        {error && <p className="scenario-lab__error">{error}</p>}

        <div className="scenario-lab__result">
          <p className="scenario-lab__result-status">
            {result ? "Scenario result" : "Awaiting scenario"}
          </p>
          <p className="scenario-lab__result-name">{selected.driver}</p>

          <dl className="scenario-lab__result-grid">
            <div>
              <dt>Original model score</dt>
              <dd>
                {fmtPct(selected.win_score)}
                <span className="scenario-lab__result-sub">
                  Rank {selected.rank ? String(selected.rank).padStart(2, "0") : "—"}
                </span>
              </dd>
            </div>
            <div>
              <dt>Scenario model score</dt>
              <dd>
                {result ? fmtPct(result.scenario_win_score) : "—"}
                <span className="scenario-lab__result-sub">
                  {result
                    ? `Rank ${result.scenario_rank ? String(result.scenario_rank).padStart(2, "0") : "—"}`
                    : "Run a scenario to compare"}
                </span>
              </dd>
            </div>
            <div>
              <dt>Model score change</dt>
              <dd
                className={
                  result && change !== 0
                    ? change > 0
                      ? "scenario-lab__change--up"
                      : "scenario-lab__change--down"
                    : ""
                }
              >
                {changeLabel}
                <span className="scenario-lab__result-sub">
                  Percentage points, original vs. scenario
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
