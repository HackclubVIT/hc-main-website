

export default function OverviewTab({ dashboardContributions, setDashboardContributions, dashboardProjects, setDashboardProjects, dashboardActivities, setDashboardActivities }) {
  return (
    <>
      <section className="panel-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Dashboard</p>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="panel-card" style={{ gridColumn: '1 / -1' }}>
            <p className="eyebrow">Contribution Overview</p>
            <div className="mini-stats-grid responsive-4col" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {dashboardContributions.map((item, index) => (
                <div key={item.label} className="summary-pill">
                  <span>{item.label}</span>
                  <input
                    value={item.value}
                    onChange={(event) => setDashboardContributions((prev) => prev.map((current, idx) => idx === index ? { ...current, value: event.target.value } : current))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="panel-section cards-grid" style={{ marginTop: '24px' }}>
          <div className="panel-card">
            <p className="eyebrow">Uploaded Projects</p>
            <div className="list-card">
              {dashboardProjects.slice(0, 3).map((project, index) => (
                <div key={project.title} className="list-item">
                  <div>
                    <strong>{project.title}</strong>
                    <p>{project.owner} · {project.status}</p>
                  </div>
                  <div>
                    <input
                      value={project.status}
                      onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, status: event.target.value } : current))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Recent Activities</p>
            <div className="activity-list">
              {dashboardActivities.slice(0, 3).map((item, index) => (
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
          </div>
        </section>
    </>
  )
}
