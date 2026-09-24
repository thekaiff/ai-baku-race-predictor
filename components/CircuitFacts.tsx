

const TURNS = [
  {
    label: "Turns 1–3 — the launch zone",
    body: "Three heavy-braking 90-degree corners straight off the pit straight. Both of Baku's DRS zones feed into this stretch, making it the circuit's clearest overtaking ground.",
  },
  {
    label: "Turn 8 — the castle section",
    body: "The tightest point of the lap: the track narrows to roughly 7.6 metres between the Old City's stone walls, barely wide enough for one car through the apex.",
  },
  {
    label: "Turns 16–20 — the run to the line",
    body: "A flat-out charge of roughly 2.2 km along the Caspian seafront — the longest full-throttle section on the F1 calendar, with cars touching close to 340 km/h.",
  },
];

export default function CircuitFacts() {
  return (
    <section className="circuit-card">
      <div className="circuit-card__map">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/circuit-map.jpg"
          alt="Baku City Circuit track map"
          className="circuit-card__map-img"
        />
      </div>
      <div className="circuit-card__stats">
        <div>
          <dt>Race Distance</dt>
          <dd>306.049 km</dd>
        </div>
        <div>
          <dt>Circuit Length</dt>
          <dd>6.003 km</dd>
        </div>
        <div>
          <dt>Laps</dt>
          <dd>51</dd>
        </div>
      </div>

      <p className="circuit-card__record">
        Lap record 1:43.009 <span>— Leclerc, 2019</span>
      </p>

      <div className="circuit-card__body">
        <h2 className="circuit-card__title">Circuit Facts</h2>
        <p className="circuit-card__intro">
          A street circuit that threads Baku&apos;s Old City before opening
          onto the longest flat-out run in Formula 1 along the Caspian
          seafront.
        </p>

        <ul className="circuit-card__turns">
          {TURNS.map((t) => (
            <li key={t.label}>
              <p className="circuit-card__turn-label">{t.label}</p>
              <p className="circuit-card__turn-body">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
