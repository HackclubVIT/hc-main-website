import { resolveUserDepartment } from '../../../data/departments';

// Members can only see the other members of their own HackClub department —
// the same roster their team lead sees.
export default function TeamTab({ users = [], department, currentUserEmail }) {
  if (!department) {
    return (
      <section className="panel-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">My Team</p>
            <h2>You haven't joined a department yet</h2>
          </div>
        </div>
        <div className="panel-card">
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Set your HackClub department in <strong>My Profile</strong> to see your teammates here.
          </p>
        </div>
      </section>
    );
  }

  const teammates = users.filter((u) => resolveUserDepartment(u) === department);

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">My Team</p>
          <h2>{department} Department · {teammates.length} {teammates.length === 1 ? 'member' : 'members'}</h2>
        </div>
      </div>
      <div className="table-card">
        <div className="table-row table-head" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr', gap: '16px' }}>
          <div>Name</div>
          <div>Role</div>
          <div>Status</div>
        </div>
        {teammates.map((u) => {
          const isMe = currentUserEmail && u.email === currentUserEmail;
          return (
            <div key={u.id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#fff' }}>
                {u.name}{isMe && <span className="pill" style={{ marginLeft: '8px', background: 'rgba(208,125,34,0.15)' }}>You</span>}
              </div>
              <div>{u.role}</div>
              <div><span className={`status-pill status-${(u.status || 'active').toLowerCase()}`}>{u.status || 'Active'}</span></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
