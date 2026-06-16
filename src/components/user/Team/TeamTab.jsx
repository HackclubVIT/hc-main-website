export default function TeamTab({ dashboardTeamUpdates, setDashboardTeamUpdates }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Team & Clubs</p>
          <h2>Connect with teams and club groups</h2>
        </div>
      </div>
      <div className="panel-card">
        <div className="timeline-list">
          {dashboardTeamUpdates.map((item, index) => (
            <div key={item.title} className="timeline-item">
              <strong>{item.title}</strong>
              <input
                value={item.detail}
                onChange={(event) => setDashboardTeamUpdates((prev) => prev.map((current, idx) => idx === index ? { ...current, detail: event.target.value } : current))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
