

export default function LoadingState() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__hero" />
      <div className="loading__row" />
      <div className="loading__row" />
      <div className="loading__row" />
      <span className="sr-only">Loading predictions…</span>
    </div>
  );
}
