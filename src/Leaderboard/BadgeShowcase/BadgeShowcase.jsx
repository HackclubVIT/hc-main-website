import { badgeDefinitions } from '../../data/mockData';

export default function BadgeShowcase() {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow" style={{ color: '#ff4081' }}>Badge Showcase</p>
          <h2>Unlock Recognition</h2>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
        Badges provide recognition beyond ranks and scores. Earn these badges by consistently contributing to the club ecosystem.
      </p>
      
      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {badgeDefinitions.map(badge => (
          <div key={badge.id} className="panel-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%' }}>
              {badge.icon}
            </div>
            <div>
              <strong style={{ fontSize: '1.1rem', display: 'block' }}>{badge.label}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
