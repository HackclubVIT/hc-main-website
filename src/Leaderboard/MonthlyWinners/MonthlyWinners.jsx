

export default function MonthlyWinners({ monthlyWinners }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow" style={{ color: '#FFD700' }}>Monthly Leaderboard</p>
          <h2>Monthly Champions</h2>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
        The monthly leaderboard carries higher importance and can be used for official club recognition.
      </p>

      <div className="cards-grid" style={{ marginBottom: '24px' }}>
        <div className="panel-card" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0,0,0,0))', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
          <p className="eyebrow" style={{ color: '#FFD700' }}>Top Project of the Month</p>
          <h3 style={{ fontSize: '2rem', marginTop: '16px' }}>🏆 {monthlyWinners.topProject}</h3>
          <p style={{ marginTop: '8px', opacity: 0.8 }}>Recognized for exceptional innovation and code quality.</p>
        </div>
      </div>

      <div className="cards-grid">
        <div className="panel-card">
          <h3>Evaluation Criteria</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '12px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li>Project Ratings</li>
            <li>Club Contributions</li>
            <li>Event Participation</li>
            <li>Mentorship Activities</li>
          </ul>
        </div>
        <div className="panel-card">
          <h3>Monthly Recognition</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '12px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li>Certificates</li>
            <li>Social Media Recognition</li>
            <li>Hall of Fame Section</li>
            <li>Special Badges</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
