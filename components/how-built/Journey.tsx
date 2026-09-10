export default function Journey() {
  const steps = ['Ask', 'Classify', 'Tools', 'Answer', 'Log'];

  return (
    <div className="flex items-center gap-2 py-4 px-6 border-b border-[var(--border)] bg-[rgba(94,234,212,0.02)]">
      <span className="text-xs uppercase tracking-wider text-[var(--accent)] opacity-60 font-mono">
        SEND JOURNEY
      </span>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {index > 0 && (
            <span className="text-[var(--accent)] opacity-40 mx-1">→</span>
          )}
          <span className="text-xs uppercase tracking-wider text-[var(--foreground)] opacity-70 font-mono px-2 py-1 bg-[rgba(94,234,212,0.05)] border border-[var(--border)] rounded-sm">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
