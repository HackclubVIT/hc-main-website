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
          
          <div className="two-col-grid" style={{ gap: '32px' }}>
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

  const top3Users = sortedUsers.slice(0, 3);

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      {/* Top 3 Grand Podium / Big Showcase */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p className="eyebrow" style={{ color: 'var(--orange)', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
            HALL OF EXCELLENCE
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', margin: '4px 0 8px 0', fontWeight: '700' }}>
            Top 3 Leaderboard Champions
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
            Celebrating our highest achieving makers, innovators, and contributors.
          </p>
        </div>

        {/* Podium Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px', 
            alignItems: 'stretch',
            marginBottom: '36px' 
          }}
        >
          {top3Users.map((user, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            const rankEmoji = isFirst ? '👑 1st Place' : isSecond ? '🥈 2nd Place' : '🥉 3rd Place';
            const rankTitle = isFirst ? 'Gold Champion' : isSecond ? 'Silver Achiever' : 'Bronze Contributor';
            const accentColor = isFirst ? '#FFD700' : isSecond ? '#E0E0E0' : '#CD7F32';
            const glowColor = isFirst 
              ? 'rgba(255, 215, 0, 0.22)' 
              : isSecond 
              ? 'rgba(224, 224, 224, 0.16)' 
              : 'rgba(205, 127, 50, 0.16)';
            
            const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

            return (
              <div
                key={user.id || idx}
                onClick={() => setSelectedMember({ ...user, rank: idx + 1 })}
                className="panel-card"
                style={{
                  cursor: 'pointer',
                  border: `2px solid ${accentColor}`,
                  boxShadow: `0 16px 36px ${glowColor}`,
                  borderRadius: '24px',
                  padding: isFirst ? '36px 28px' : '30px 24px',
                  background: isFirst 
                    ? 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.12), rgba(18, 2, 2, 0.95) 75%)' 
                    : 'rgba(18, 2, 2, 0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  position: 'relative',
                  transform: isFirst ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  order: isFirst ? 1 : isSecond ? 0 : 2
                }}
              >
                {/* Top Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      background: isFirst ? 'rgba(255, 215, 0, 0.18)' : 'rgba(255, 255, 255, 0.08)', 
                      color: accentColor, 
                      padding: '6px 14px', 
                      borderRadius: '999px', 
                      fontSize: '0.85rem', 
                      fontWeight: '700',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {rankEmoji}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {rankTitle}
                  </span>
                </div>

                {/* Avatar & User Info */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: isFirst ? '96px' : '80px', 
                      height: isFirst ? '96px' : '80px', 
                      borderRadius: '50%', 
                      background: `linear-gradient(135deg, ${accentColor}, #801010)`, 
                      color: '#000', 
                      display: 'grid', 
                      placeItems: 'center', 
                      fontSize: isFirst ? '2.2rem' : '1.8rem', 
                      fontWeight: '900',
                      marginBottom: '16px',
                      border: `3px solid ${accentColor}`,
                      boxShadow: `0 0 24px ${glowColor}`
                    }}
                  >
                    {initials}
                  </div>
                  <h3 style={{ fontSize: isFirst ? '1.75rem' : '1.45rem', margin: '0 0 6px 0', color: '#fff', fontWeight: '700' }}>
                    {user.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '6px' }}>
                    {user.role || 'Club Member'}
                  </span>
                </div>

                {/* Big Score Callout */}
                <div 
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.45)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    textAlign: 'center' 
                  }}
                >
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Total Score
                  </span>
                  <div style={{ fontSize: isFirst ? '2.8rem' : '2.3rem', fontWeight: '900', color: accentColor, lineHeight: 1 }}>
                    {user.totalScore}
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '500' }}>PTS</span>
                  </div>
                </div>

                {/* Stats Breakdown Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 4px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Projects</div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{user.projectRatingScore || user.projectsUploaded || 0}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 4px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Contrib</div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{user.contributionScore || 0}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 4px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Events</div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{user.eventScore || 0}</strong>
                  </div>
                </div>

                {/* Badges Preview */}
                {user.badges && user.badges.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    <BadgeList badges={user.badges} maxDisplay={3} />
                  </div>
                )}

                <button 
                  className="button button-outlined"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px', border: `1px solid ${accentColor}44`, color: accentColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember({ ...user, rank: idx + 1 });
                  }}
                >
                  View Full Profile →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Large Top 3 Detailed Table */}
      <div className="table-card" style={{ padding: '8px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div 
          className="table-row table-head" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '100px 1.5fr 1fr 140px 1.2fr', 
            gap: '16px', 
            alignItems: 'center',
            padding: '16px 20px',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}
        >
          <div>Rank</div>
          <div>Member Name</div>
          <div>Role</div>
          <div style={{ textAlign: 'center' }}>Total Score</div>
          <div>Badges Earned</div>
        </div>

        {top3Users.map((user, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const rankColor = isFirst ? '#FFD700' : isSecond ? '#C0C0C0' : '#CD7F32';
          const medal = isFirst ? '🥇' : isSecond ? '🥈' : '🥉';
          const rankLabel = isFirst ? '1st' : isSecond ? '2nd' : '3rd';

          return (
            <div 
              key={user.id} 
              className="table-row" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '100px 1.5fr 1fr 140px 1.2fr', 
                gap: '16px', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '20px 20px',
                borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                background: isFirst ? 'rgba(255, 215, 0, 0.03)' : 'transparent',
                transition: 'background 0.2s ease, transform 0.2s ease'
              }}
              onClick={() => setSelectedMember({ ...user, rank: index + 1 })}
            >
              {/* Rank */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem' }}>{medal}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: rankColor }}>{rankLabel}</span>
              </div>

              {/* Member Name */}
              <div>
                <strong style={{ fontSize: '1.25rem', color: '#fff', display: 'block', marginBottom: '2px' }}>{user.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID #{user.id} • {user.projectsUploaded || 0} Projects</span>
              </div>

              {/* Role */}
              <div>
                <span 
                  style={{ 
                    fontSize: '0.8rem', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    background: 'rgba(255, 255, 255, 0.06)', 
                    color: 'var(--text)' 
                  }}
                >
                  {user.role || 'Member'}
                </span>
              </div>

              {/* Total Score */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: rankColor }}>
                  {user.totalScore}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>pts</span>
              </div>

              {/* Badges */}
              <div>
                <BadgeList badges={user.badges} maxDisplay={2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Fair Scoring Breakdown */}
      <div className="panel-card" style={{ marginTop: '36px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '24px 28px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1.15rem' }}>📊 Scoring Formula & Tie-Breaking</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6', fontSize: '0.9rem' }}>
          Leaderboard ranking is strictly calculated using a weighted formula to ensure fair evaluation across all activities:
        </p>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--orange)' }}>Score Weights:</strong>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.88rem' }}>
              <li><strong>70%</strong> Project Ratings</li>
              <li><strong>20%</strong> Club Contributions</li>
              <li><strong>10%</strong> Event Participation</li>
            </ul>
          </div>
          <div style={{ flex: 1.2, minWidth: '280px' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--amber)' }}>Formula:</strong>
            <div style={{ fontFamily: 'monospace', color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '14px 18px', borderRadius: '10px', fontSize: '0.88rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>Total = (Project × 0.70) + (Contrib × 0.20) + (Event × 0.10)</div>
              <div style={{ marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Only the verified Top 3 makers are spotlighted on this official club leaderboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
