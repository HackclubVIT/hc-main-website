import { useState, useEffect } from 'react';

const ScoreInput = ({ value, onChangeScore }) => {
  const [localVal, setLocalVal] = useState(value || '');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalVal(value || '');
  }, [value]);

  const commitChange = () => {
    let parsed = parseInt(localVal, 10);
    if (isNaN(parsed)) parsed = 1;
    if (parsed > 100) parsed = 100;
    if (parsed < 1) parsed = 1;
    setLocalVal(parsed);
    if (parsed !== value) {
      onChangeScore(parsed);
    }
  };

  return (
    <input 
      type="number" 
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={commitChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      }}
      min="1" max="100"
      style={{ width: '60px', padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
    />
  );
};

export default function AdminLeaderboardManagement({ weeklyWinners, users, setUsers, projects, addAnnouncement }) {
  
  const sortedUsers = [...users].sort((a, b) => b.totalScore - a.totalScore);
  const actualTopContributor = sortedUsers.length > 0 ? sortedUsers[0].name : weeklyWinners.topContributor;
  const actualMostActive = sortedUsers.length > 0 ? [...users].sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))[0].name : weeklyWinners.mostActive;

  const topProjects = [...projects]
    .filter(p => !isNaN(parseFloat(p.rating)))
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 3);
  const actualTopProject = topProjects.length > 0 ? topProjects[0].title : weeklyWinners.topProject;

  const handlePublishWinners = () => {
    addAnnouncement({
      title: '🏆 Weekly Winners Announced!',
      body: `Congratulations to ${actualTopContributor} for being the Top Contributor, and "${actualTopProject}" for being the Top Project of the week!`,
      label: 'Winner'
    });
    window.alert('Weekly Winners have been published to Announcements!');
  };

  const handleRefreshRankings = () => {
    const updatedUsers = users.map(user => {
      const userProjects = projects.filter(p => p.owner === user.name);
      let totalRatingSum = 0;
      let ratedProjectsCount = 0;
      
      userProjects.forEach(p => {
        const pRating = parseFloat(p.rating);
        if (!isNaN(pRating) && pRating > 0) {
          totalRatingSum += pRating;
          ratedProjectsCount++;
        }
      });
      
      const newAvgRating = ratedProjectsCount > 0 ? (totalRatingSum / ratedProjectsCount) : 0;
      const newProjectRatingScore = Math.round((newAvgRating / 10) * 100);
      
      const newTotalScore = Math.round(
        (newProjectRatingScore * 0.7) + 
        ((user.contributionScore || 0) * 0.2) + 
        ((user.eventScore || 0) * 0.1)
      );
      
      return { 
        ...user, 
        averageRating: newAvgRating.toFixed(1),
        projectRatingScore: newProjectRatingScore,
        totalScore: newTotalScore 
      };
    });
    
    setUsers(updatedUsers);
    window.alert('Rankings have been successfully refreshed and sorted based on the latest live project ratings!');
  };



  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Leaderboard Management</p>
          <h2>Manage weekly rankings and announcements</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="button button-outlined" onClick={handleRefreshRankings}>Refresh Rankings</button>
          <button className="button button-primary" onClick={handlePublishWinners}>Publish Weekly Winners</button>
        </div>
      </div>
      
      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="panel-card card-highlight">
          <p className="eyebrow">Top Contributor of the Week</p>
          <h3>{actualTopContributor}</h3>
        </div>
        <div className="panel-card card-accent">
          <p className="eyebrow">Top Project of the Week</p>
          <h3>{actualTopProject}</h3>
        </div>
        <div className="panel-card">
          <p className="eyebrow">Most Active Member</p>
          <h3>{actualMostActive}</h3>
        </div>
        <div className="panel-card">
          <p className="eyebrow" style={{ color: '#00e5ff' }}>Best Innovation</p>
          <h3>{weeklyWinners.bestInnovation}</h3>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: '24px' }}>
        <h3 style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Top 3 Projects</h3>
        <div className="table-row table-head grid-col-projects">
          <div>Rank</div>
          <div>Project</div>
          <div>Owner</div>
          <div>Status</div>
          <div>Rating</div>
        </div>
        {topProjects.map((project, index) => (
          <div key={project.id} className="table-row grid-col-projects" style={{ alignItems: 'center' }}>
            <div><strong style={{ color: 'var(--highlight)', fontSize: '1.2rem' }}>#{index + 1}</strong></div>
            <div>
              <strong>{project.title}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.technologiesUsed?.join(', ')}</div>
            </div>
            <div>{project.owner}</div>
            <div><span className={`status-pill status-${project.status.toLowerCase()}`}>{project.status}</span></div>
            <div>{project.rating} ⭐</div>
          </div>
        ))}
      </div>

      <div className="table-card" style={{ marginTop: '24px' }}>
        <h3 style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Current Live Leaderboard Rankings</h3>
        <div className="table-row table-head grid-col-leaderboard-live">
          <div>Rank</div>
          <div>Name</div>
          <div>Project Score</div>
          <div>Contrib Score</div>
          <div>Event Score</div>
          <div>Total Score</div>
          <div>Actions</div>
        </div>
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="table-row grid-col-leaderboard-live" style={{ alignItems: 'center' }}>
            <div>#{index + 1}</div>
            <div>
              <strong>{user.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.badges.join(', ')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ScoreInput 
                value={user.projectRatingScore}
                onChangeScore={(val) => {
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, projectRatingScore: val, totalScore: Math.round(val * 0.7 + (u.contributionScore || 0) * 0.2 + (u.engagementScore || 0) * 0.1) } : u));
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ScoreInput 
                value={user.contributionScore}
                onChangeScore={(val) => {
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, contributionScore: val, totalScore: Math.round((u.projectRatingScore || 0) * 0.7 + val * 0.2 + (u.engagementScore || 0) * 0.1) } : u));
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ScoreInput 
                value={user.engagementScore}
                onChangeScore={(val) => {
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, engagementScore: val, totalScore: Math.round((u.projectRatingScore || 0) * 0.7 + (u.contributionScore || 0) * 0.2 + val * 0.1) } : u));
                }}
              />
            </div>
            <div>
              <div style={{ padding: '8px 16px', background: 'rgba(208, 125, 34, 0.1)', color: 'var(--highlight, #ffaa00)', border: '1px solid rgba(208, 125, 34, 0.4)', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block', minWidth: '80px', textAlign: 'center' }}>
                {user.totalScore}
              </div>
            </div>
            <div>
              <button 
                className="button button-outlined" 
                style={{ color: '#ff5555', borderColor: 'rgba(255,85,85,0.3)', padding: '4px 8px', fontSize: '12px' }}
                onClick={() => {
                  if(window.confirm(`Are you sure you want to remove ${user.name} from the leaderboard?`)) {
                    setUsers(prev => prev.filter(u => u.id !== user.id));
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
