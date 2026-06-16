

export default function HallOfFame({ monthlyWinners }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow" style={{ color: '#CD7F32' }}>Hall of Fame</p>
          <h2>All-Time Club Legends</h2>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
        A permanent showcase of members who have left a lasting impact on the club ecosystem.
      </p>

      <div className="cards-grid">
        <div className="panel-card" style={{ background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.1), rgba(0,0,0,0))', border: '1px solid rgba(205, 127, 50, 0.3)' }}>
          <p className="eyebrow" style={{ color: '#CD7F32' }}>Inducted Members</p>
          <ul style={{ paddingLeft: '20px', marginTop: '16px', fontSize: '1.2rem', lineHeight: '1.8' }}>
            {monthlyWinners.hallOfFame.map(member => (
              <li key={member}>⭐ {member}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
