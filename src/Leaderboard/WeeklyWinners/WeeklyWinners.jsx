export default function WeeklyWinners({ weeklyWinners }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow" style={{ color: '#00e5ff' }}>Weekly Winners</p>
          <h2>This Week's Top Achievers</h2>
        </div>
      </div>
      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏆</div>
          <p className="eyebrow" style={{ fontSize: '0.85rem' }}>Top Contributor</p>
          <strong style={{ fontSize: '1.25rem' }}>{weeklyWinners.topContributor}</strong>
        </div>
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚀</div>
          <p className="eyebrow" style={{ fontSize: '0.85rem' }}>Top Project</p>
          <strong style={{ fontSize: '1.25rem' }}>{weeklyWinners.topProject}</strong>
        </div>
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔥</div>
          <p className="eyebrow" style={{ fontSize: '0.85rem' }}>Most Active Member</p>
          <strong style={{ fontSize: '1.25rem' }}>{weeklyWinners.mostActive}</strong>
        </div>
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💡</div>
          <p className="eyebrow" style={{ fontSize: '0.85rem' }}>Best Innovation</p>
          <strong style={{ fontSize: '1.25rem' }}>{weeklyWinners.bestInnovation}</strong>
        </div>
      </div>
      <div className="panel-card" style={{ marginTop: '24px', background: 'rgba(255, 255, 255, 0.02)' }}>
        <h3>Weekly Reset</h3>
        <p style={{ marginTop: '12px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          The weekly leaderboard resets every week to provide equal opportunities for all members. 
          This prevents the same members from permanently occupying the top positions and keeps competition active.
        </p>
      </div>
    </section>
  );
}
