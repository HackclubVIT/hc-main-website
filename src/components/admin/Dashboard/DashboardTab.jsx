export default function DashboardTab({ adminUploads, globalAnnouncements, users, projects }) {
  const pendingProjectsCount = projects ? projects.filter(p => p.status === 'Pending').length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <section className="panel-section hero-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(208, 125, 34, 0.1) 0%, rgba(18, 2, 2, 0) 100%)',
        border: '1px solid rgba(208, 125, 34, 0.2)',
        borderRadius: '16px',
        padding: '32px'
      }}>
        <div className="hero-copy">
          <p className="eyebrow" style={{ color: 'var(--accent)' }}>Admin Dashboard Overview</p>
          <h2 style={{ fontSize: '2.5rem', margin: '8px 0' }}>Welcome to your HackClub Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Monitor projects, approve uploads, manage members, and keep community activity on track. Everything you need is right here.
          </p>
        </div>
      </section>

      {/* Primary Stats */}
      <section className="panel-section">
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>At a Glance</h3>
        <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="panel-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <p className="eyebrow">Members</p>
            <h3 style={{ fontSize: '2rem', margin: '8px 0', color: 'white' }}>{users ? users.length : 0}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Registered members</p>
          </div>
          <div className="panel-card" style={{ borderLeft: '4px solid #4caf50' }}>
            <p className="eyebrow">Projects</p>
            <h3 style={{ fontSize: '2rem', margin: '8px 0', color: 'white' }}>{projects ? projects.length : 0}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Submitted projects</p>
          </div>
          <div className="panel-card" style={{ borderLeft: '4px solid #00bcd4' }}>
            <p className="eyebrow">Reviewers</p>
            <h3 style={{ fontSize: '2rem', margin: '8px 0', color: 'white' }}>{users ? users.filter(u => u.isReviewer).length : 0}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Active evaluators</p>
          </div>
          <div className="panel-card" style={{ borderLeft: pendingProjectsCount > 0 ? '4px solid #ffaa00' : '4px solid #4caf50' }}>
            <p className="eyebrow">Pending Projects</p>
            <h3 style={{ fontSize: '2rem', margin: '8px 0', color: pendingProjectsCount > 0 ? '#ffaa00' : '#4caf50' }}>{pendingProjectsCount}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Require approval</p>
          </div>
        </div>
      </section>

      {/* Announcements and Uptime Info */}
      <section className="panel-section">
        <div className="cards-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="panel-card card-accent" style={{ background: 'linear-gradient(to bottom right, rgba(255,85,85,0.1), transparent)' }}>
            <p className="eyebrow">Latest Announcement</p>
            <strong style={{ display: 'block', margin: '8px 0', fontSize: '1.2rem' }}>{globalAnnouncements[0]?.title || 'No recent updates'}</strong>
            <p style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {globalAnnouncements[0]?.body || 'Keep your community informed by posting an update.'}
            </p>
          </div>
          {/* <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>🟢</span>
            </div>
            <p className="eyebrow">System Status</p>
            <h3 style={{ margin: '4px 0', fontSize: '1.2rem' }}>All Systems Nominal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>99.9% Uptime this month</p>
          </div> */}
        </div>
      </section>

      {/* Lower Section: Quick Actions & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* <section className="panel-section">
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="panel-card" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', ':hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📝</div>
              <h4 style={{ margin: '0 0 4px 0' }}>Review Projects</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Evaluate new member submissions</p>
            </div>
            <div className="panel-card" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', ':hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📢</div>
              <h4 style={{ margin: '0 0 4px 0' }}>Broadcast Update</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Send an announcement to all</p>
            </div>
            <div className="panel-card" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', ':hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏆</div>
              <h4 style={{ margin: '0 0 4px 0' }}>Update Leaderboard</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Publish this week's top members</p>
            </div>
            <div className="panel-card" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', ':hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>👥</div>
              <h4 style={{ margin: '0 0 4px 0' }}>Manage Users</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Review member access & roles</p>
            </div>
          </div>
        </section> */}

        {projects && projects.length > 0 && (
          <section className="panel-section">
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>Recent Activity</h3>
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.slice(-4).reverse().map((project, index) => (
                <div key={`${project.id || project.title || index}`} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px' }}></div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>
                      <strong>{project.owner || project.submitter || 'Someone'}</strong> submitted a new project: "{project.title || 'Untitled Project'}"
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{project.submittedAt || project.createdAt || project.date || 'Recently'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
