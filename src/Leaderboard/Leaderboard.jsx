import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [viewType, setViewType] = useState('allTime'); // 'allTime' or 'monthly'
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Aarav Sharma", allTimePoints: 1420, monthlyPoints: 450, projects: 5, badges: ["🥇 Top Contributor", "🚀 Code Ninja"] },
    { id: 2, name: "Ananya Iyer", allTimePoints: 1280, monthlyPoints: 520, projects: 4, badges: ["🚀 Code Ninja"] },
    { id: 3, name: "Rohan Das", allTimePoints: 1100, monthlyPoints: 310, projects: 3, badges: ["🥈 Bug Hunter"] },
    { id: 4, name: "Sneha Patel", allTimePoints: 950, monthlyPoints: 290, projects: 3, badges: ["🎨 UI Wizard"] },
    { id: 5, name: "Kabir Verma", allTimePoints: 820, monthlyPoints: 410, projects: 2, badges: ["⚡ Active Member"] }
  ]);

  const handlePointsChange = (id, newPoints) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const pointsNum = parseInt(newPoints) || 0;
        return viewType === 'allTime' 
          ? { ...user, allTimePoints: pointsNum }
          : { ...user, monthlyPoints: pointsNum };
      }
      return user;
    }));
    alert("Points updated successfully on the frontend!");
  };

  const sortedUsers = [...users].sort((a, b) => 
    viewType === 'allTime' ? b.allTimePoints - a.allTimePoints : b.monthlyPoints - a.monthlyPoints
  );

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);
  const currentLeader = sortedUsers[0]?.name || "No one";

  return (
    <div className="leaderboard-body">
      <div className="module-wrapper">
        <div className="header-section">
          <span className="module-badge">RATING & LEADERBOARD MODULE</span>
          <button className="admin-toggle-btn" onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? "👁️ View Public Leaderboard" : "🔧 Switch to Admin Controls"}
          </button>
        </div>

        {!isAdmin ? (
          <>
            <div className="tabs-container">
              <button className={`tab-btn ${viewType === 'allTime' ? 'active' : ''}`} onClick={() => setViewType('allTime')}>
                All-Time Leaderboard
              </button>
              <button className={`tab-btn ${viewType === 'monthly' ? 'active' : ''}`} onClick={() => setViewType('monthly')}>
                Monthly Rankings
              </button>
            </div>

            <div className="podium-container">
              {topThree[1] && (
                <div className="podium-card silver-spot">
                  <span className="podium-rank">#2</span>
                  <div className="avatar-placeholder">🥈</div>
                  <h3>{topThree[1].name}</h3>
                  <p className="points-display">{viewType === 'allTime' ? topThree[1].allTimePoints : topThree[1].monthlyPoints} pts</p>
                </div>
              )}
              {topThree[0] && (
                <div className="podium-card gold-spot">
                  <span className="crown-icon">👑</span>
                  <span className="podium-rank">#1</span>
                  <div className="avatar-placeholder">🥇</div>
                  <h3>{topThree[0].name}</h3>
                  <p className="points-display">{viewType === 'allTime' ? topThree[0].allTimePoints : topThree[0].monthlyPoints} pts</p>
                </div>
              )}
              {topThree[2] && (
                <div className="podium-card bronze-spot">
                  <span className="podium-rank">#3</span>
                  <div className="avatar-placeholder">🥉</div>
                  <h3>{topThree[2].name}</h3>
                  <p className="points-display">{viewType === 'allTime' ? topThree[2].allTimePoints : topThree[2].monthlyPoints} pts</p>
                </div>
              )}
            </div>

            <div className="quote-banner">
              <p>🔥 <span>Notice:</span> Currently, <strong>{currentLeader}</strong> is setting the pace. Who is going to step up and challenge the throne?</p>
            </div>

            <div className="table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Member</th>
                    <th>Projects</th>
                    <th>Badges</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr key={user.id} className="table-row">
                      <td className="rank-cell">#{index + 1}</td>
                      <td className="name-cell">{user.name}</td>
                      <td>{user.projects} Loaded</td>
                      <td>
                        <div className="badges-flex">
                          {user.badges.map((b, i) => <span key={i} className="badge-pill">{b}</span>)}
                        </div>
                      </td>
                      <td className="points-cell">{viewType === 'allTime' ? user.allTimePoints : user.monthlyPoints} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="admin-panel">
            <h2>🛡️ Administrative Management Portal</h2>
            <p className="admin-subtitle">Modify live metrics for the {viewType === 'allTime' ? 'All-Time' : 'Monthly'} timeline registry:</p>
            <div className="admin-list">
              {users.map(user => (
                <div key={user.id} className="admin-row">
                  <div className="admin-user-info">
                    <span className="admin-username">{user.name}</span>
                    <span className="admin-current-pts">Current: {viewType === 'allTime' ? user.allTimePoints : user.monthlyPoints} pts</span>
                  </div>
                  <input 
                    type="number" 
                    className="admin-input-field"
                    placeholder="New value..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePointsChange(user.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;