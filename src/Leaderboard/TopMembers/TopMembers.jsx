import { useState } from 'react';
import BadgeList from '../BadgeShowcase/BadgeList';


export default function TopMembers({ users, projects }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const sortedUsers = [...users].sort((a, b) => b.totalScore - a.totalScore);

  // Dynamic calculations for selected member
  const memberProjects = selectedMember && projects ? projects.filter(p => p.owner === selectedMember.name) : [];
  const projectsCount = memberProjects.length;
  const ratings = memberProjects.map(p => parseFloat(p.rating)).filter(r => !isNaN(r) && r > 0);
  const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : '0.0';

  const projectHistory = memberProjects.map(p => ({
    title: 'Submitted project',
    detail: `Uploaded "${p.title}" with status "${p.status}"`,
    time: p.submissionDate || 'N/A'
  }));

  const evaluationHistory = [];
  if (selectedMember && projects) {
    projects.forEach(p => {
      if (p.individualRatings) {
        const ratingObj = p.individualRatings.find(r => r.user === selectedMember.name);
        if (ratingObj) {
          evaluationHistory.push({
            title: 'Reviewed project',
            detail: `Rated "${p.title}" as ${ratingObj.rating}/10 - "${ratingObj.comment}"`,
            time: 'N/A'
          });
        }
      }
    });
  }

  const contributionsHistory = [...projectHistory, ...evaluationHistory];

  if (selectedMember) {
    return (
      <div style={{ animation: 'fadeIn 0.3s' }}>
        <button 
          onClick={() => setSelectedMember(null)} 
          className="button button-outlined" 
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span>←</span> Back to Leaderboard
        </button>
        
        <div className="panel-card" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>{selectedMember.name}'s Profile</h2>
          
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '32px' }}>
            <div className="panel-card card-highlight">
              <p className="eyebrow">Current Rank</p>
              <h3>#{selectedMember.rank}</h3>
            </div>
            <div className="panel-card">
              <p className="eyebrow">Total Score</p>
              <h3>{selectedMember.totalScore}</h3>
            </div>
            <div className="panel-card">
              <p className="eyebrow">Projects Uploaded</p>
              <h3>{projectsCount}</h3>
            </div>
            <div className="panel-card">
              <p className="eyebrow">Average Rating</p>
              <h3>{averageRating} ⭐</h3>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>Badges Earned</h3>
              <BadgeList badges={selectedMember.badges} />
              
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', marginTop: '32px' }}>Recent Projects</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
                {memberProjects.length > 0 ? memberProjects.map(p => (
                  <li key={p.id} style={{ marginBottom: '8px' }}>
                    <strong>{p.title}</strong> ({p.rating} ⭐)
                  </li>
                )) : (
                  <li style={{ color: 'var(--text-muted)' }}>No projects uploaded yet.</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>Contribution History</h3>
              <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contributionsHistory.length > 0 ? contributionsHistory.map((item, index) => (
                  <div key={index} className="panel-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>{item.title}</strong>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.detail}</p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'block', marginTop: '8px' }}>{item.time}</span>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)' }}>No recent contributions recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="panel-card" style={{ marginBottom: '32px', background: 'rgba(255, 255, 255, 0.02)' }}>
        <h3 style={{ marginBottom: '12px' }}>📊 Scoring System</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          To ensure fair evaluation, the Total Score is calculated using a weighted formula:
        </p>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Score Distribution:</strong>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <li><strong>70%</strong> Project Ratings</li>
              <li><strong>20%</strong> Club Contributions</li>
              <li><strong>10%</strong> Event Participation</li>
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Example Calculation:</strong>
            <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <div>Project Rating Score = 90</div>
              <div>Contribution Score = 80</div>
              <div>Event Score = 70</div>
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                Total Score = (90 × 0.70) + (80 × 0.20) + (70 × 0.10) = <strong>86</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-row table-head grid-col-leaderboard-members" style={{ gridTemplateColumns: '80px 1fr 150px 200px' }}>
          <div>Rank</div>
          <div>Member Name</div>
          <div>Total Score</div>
          <div>Badges</div>
        </div>
        {sortedUsers.slice(0, 10).map((user, index) => (
          <div 
            key={user.id} 
            className="table-row grid-col-leaderboard-members" 
            style={{ alignItems: 'center', cursor: 'pointer', gridTemplateColumns: '80px 1fr 150px 200px' }}
            onClick={() => setSelectedMember({ ...user, rank: index + 1 })}
          >
            <div style={{ fontSize: index < 3 ? '24px' : '18px', fontWeight: 'bold', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'inherit' }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.totalScore}</div>
            <div>
              <BadgeList badges={user.badges} maxDisplay={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
