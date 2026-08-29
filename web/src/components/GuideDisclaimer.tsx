export function GuideDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="card guide-disclaimer">
      <span className="guide-disclaimer-icon">⚠️</span>
      <p>{children}</p>
    </div>
  )
}
