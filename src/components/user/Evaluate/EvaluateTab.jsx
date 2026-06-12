export default function EvaluateTab({ dashboardProjects }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Reviewer Portal</p>
          <h2>Evaluate and rate submitted projects</h2>
        </div>
      </div>
      <div className="list-card">
        {dashboardProjects.length > 0 ? dashboardProjects.map(project => (
          <div key={project.title} className="list-item" style={{ flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{project.title}</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Owner: {project.owner} · Status: {project.status}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <input type="number" min="1" max="10" placeholder="Rate 1-10" style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'center' }} />
                 <button className="button button-primary" onClick={() => window.alert(`Rating submitted for ${project.title}!`)}>Submit Rating</button>
              </div>
            </div>
          </div>
        )) : <p style={{ color: 'var(--text-muted)' }}>No projects available for evaluation.</p>}
      </div>
    </section>
  )
}
