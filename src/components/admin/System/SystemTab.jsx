export default function SystemTab({ adminSystemStatus }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Database / System Management</p>
          <h2>Monitor uptime, backups, and system health</h2>
        </div>
      </div>
      <div className="cards-grid">
        {adminSystemStatus.map((item) => (
          <div key={item.label} className="panel-card">
            <p className="eyebrow">{item.label}</p>
            <h3>{item.value}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
