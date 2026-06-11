export default function AnalyticsTab({ dashboardAnalytics, setDashboardAnalytics }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Your activity metrics and performance</h2>
        </div>
      </div>
      <div className="cards-grid">
        {dashboardAnalytics.map((item, index) => (
          <div key={item.label} className="panel-card">
            <p className="eyebrow">{item.label}</p>
            <input
              value={item.value}
              onChange={(event) => setDashboardAnalytics((prev) => prev.map((current, idx) => idx === index ? { ...current, value: event.target.value } : current))}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
