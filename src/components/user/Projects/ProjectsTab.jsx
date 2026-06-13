

export default function ProjectsTab({ dashboardProjects, setDashboardProjects, setGlobalUploads, showAddProject, setShowAddProject, newProject, setNewProject, globalProfile }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">My Projects</p>
          <h2>Your uploaded projects and submissions</h2>
        </div>
        <button className="button button-primary" type="button" onClick={() => setShowAddProject(!showAddProject)}>
          {showAddProject ? 'Cancel' : 'Add Project'}
        </button>
      </div>
      {showAddProject && (
        <div className="panel-card" style={{ marginBottom: '24px' }}>
          <h3>Submit a new project</h3>
          <form className="responsive-2col" onSubmit={(e) => {
            e.preventDefault();
            const projectToSubmit = {
              id: Date.now(),
              title: newProject.title,
              description: newProject.description,
              github: newProject.github,
              deployment: newProject.deployment,
              status: 'Pending',
              owner: globalProfile?.name || 'Priya Sharma',
              rating: '0.0',
              submissionDate: new Date().toISOString().split('T')[0],
              technologiesUsed: ['React', 'CSS'],
              individualRatings: [],
              awards: []
            };
            setDashboardProjects(prev => [projectToSubmit, ...prev]);
            setNewProject({ title: '', description: '', github: '', deployment: '', status: 'Pending', owner: globalProfile?.name || 'Priya Sharma', rating: '0.0' });
            setShowAddProject(false);
            window.alert('Project submitted! Waiting for admin approval.');
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <label style={{ gridColumn: '1 / -1' }}>
              Title
              <input type="text" value={newProject.title} onChange={e => setNewProject(p => ({...p, title: e.target.value}))} required style={{ marginTop: '8px' }}/>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              Description
              <textarea 
                value={newProject.description} 
                onChange={e => setNewProject(p => ({...p, description: e.target.value}))} 
                rows="3" 
                required 
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                  border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                  color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </label>
            <label>
              GitHub Link
              <input type="url" value={newProject.github} onChange={e => setNewProject(p => ({...p, github: e.target.value}))} required style={{ marginTop: '8px' }}/>
            </label>
            <label>
              Deployment Link
              <input type="url" value={newProject.deployment} onChange={e => setNewProject(p => ({...p, deployment: e.target.value}))} required style={{ marginTop: '8px' }}/>
            </label>
            <button className="button button-primary" type="submit" style={{ gridColumn: '1 / -1', justifySelf: 'start', marginTop: '8px' }}>
              Submit Project
            </button>
          </form>
        </div>
      )}
      <div className="list-card">
        {dashboardProjects.map((project, index) => (
          <div key={project.title} className="list-item" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{project.title}</strong>
                <p>{project.owner} · {project.status}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  value={project.status}
                  onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, status: event.target.value } : current))}
                  style={{ width: '100px' }}
                />
                <input
                  value={project.rating}
                  onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, rating: event.target.value } : current))}
                  style={{ width: '60px' }}
                />
                <span>{project.rating} ★</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Contributors: {project.contributors || 'None'}</span>
              <button 
                className="button button-outlined" 
                style={{ color: '#ff5555', borderColor: 'rgba(255,85,85,0.3)', padding: '4px 12px', fontSize: '12px' }}
                onClick={() => setDashboardProjects(prev => prev.filter((_, idx) => idx !== index))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
