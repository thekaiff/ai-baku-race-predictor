
export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__label">Update failed</span>
      <span className="error-banner__message">
        {message} — showing the last successful results.
      </span>
    </div>
  );
}
