export default function ActivityTab({ dashboardActivities, setDashboardActivities }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Your recent activities and contributions</h2>
        </div>
      </div>
      <div className="activity-list">
        {dashboardActivities.map((item, index) => (
          <div key={item.label} className="activity-item">
            <div>
              <strong>{item.label}</strong>
              <input
                value={item.detail}
                onChange={(event) => setDashboardActivities((prev) => prev.map((current, idx) => idx === index ? { ...current, detail: event.target.value } : current))}
              />
            </div>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
