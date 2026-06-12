import { badgeDefinitions } from '../../data/mockData';

export default function BadgeList({ badges, maxDisplay }) {
  if (!badges || badges.length === 0) return <span>-</span>;

  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const extraCount = maxDisplay && badges.length > maxDisplay ? badges.length - maxDisplay : 0;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      {displayBadges.map(badgeName => {
        const def = badgeDefinitions.find(b => b.label === badgeName);
        return (
          <span 
            key={badgeName} 
            title={badgeName}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
              backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {def ? def.icon : '🏅'} {def ? def.label : badgeName}
          </span>
        );
      })}
      {extraCount > 0 && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+{extraCount} more</span>
      )}
    </div>
  );
}
