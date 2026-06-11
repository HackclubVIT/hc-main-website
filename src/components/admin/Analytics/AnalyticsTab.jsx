

export default function AdminAnalytics({ users, projects }) {
  const activeReviewers = users.filter(u => u.isReviewer).length;
  const pendingProjects = projects.filter(p => p.status === 'Pending').length;

  const handleExport = () => {
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const topContributors = [...users].sort((a,b) => (b.contributionScore || 0) - (a.contributionScore || 0)).slice(0, 3).map(u => `${u.name} (${u.contributionScore || 0} pts)`).join(', ');

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Members,${users.length}\n`
      + `Active Users,${activeUsers}\n`
      + `Reviewers,${activeReviewers}\n`
      + `Total Projects,${projects.length}\n`
      + `Pending Projects,${pendingProjects}\n`
      + `Top Contributors,"${topContributors}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hackclub_analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">View Analytics</p>
          <h2>Track participation, uploads, and performance</h2>
        </div>
        <button className="button button-secondary" onClick={handleExport}>Export report</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="cards-grid">
          <div className="panel-card">
            <p className="eyebrow">Total Members</p>
            <h3>{users ? users.length : 120}</h3>
            <p>Active and registered members.</p>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Total Projects</p>
            <h3>{projects ? projects.length : 45}</h3>
            <p>Projects submitted this semester.</p>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Reviewers</p>
            <h3>{activeReviewers || 10}</h3>
            <p>Members with review access.</p>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Pending Projects</p>
            <h3>{pendingProjects || 5}</h3>
            <p>Requires admin approval.</p>
          </div>
        </div>

        <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="panel-card">
            <p className="eyebrow">Projects Uploaded This Week</p>
            <h3>12</h3>
            <p style={{ color: '#4caf50' }}>↑ 20% vs last week</p>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Active Users</p>
            <h3>{users ? users.filter(u => u.status === 'Active').length : 85}</h3>
            <p>Users logged in within 30 days.</p>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Top Contributors</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {users ? [...users].sort((a,b) => (b.contributionScore || 0) - (a.contributionScore || 0)).slice(0, 3).map((u, i) => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{i + 1}. {u.name}</span>
                  <strong style={{ color: 'var(--highlight)' }}>{u.contributionScore || 0} pts</strong>
                </div>
              )) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
