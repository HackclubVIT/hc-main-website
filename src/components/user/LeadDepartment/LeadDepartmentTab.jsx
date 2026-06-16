import { resolveUserDepartment } from '../../../data/departments';

// Lead-only view: the members of the lead's department and every project those
// members have submitted. These are the two extra capabilities a lead gets on
// top of the normal member dashboard.
export default function LeadDepartmentTab({ users = [], projects = [], department }) {
  const members = users.filter((u) => resolveUserDepartment(u) === department);
  const memberNames = new Set(members.map((m) => m.name));
  const deptProjects = projects.filter((p) => memberNames.has(p.owner));

  const projectsByOwner = (name) => deptProjects.filter((p) => p.owner === name).length;

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Lead Dashboard</p>
          <h2>{department} Department</h2>
        </div>
      </div>

      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '24px' }}>
        <div className="panel-card">
          <p className="eyebrow">Department Members</p>
          <h3>{members.length}</h3>
        </div>
        <div className="panel-card">
          <p className="eyebrow">Projects Submitted</p>
          <h3>{deptProjects.length}</h3>
        </div>
      </div>

      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <p className="eyebrow">Members</p>
        <div className="table-card" style={{ marginTop: '16px', border: 'none' }}>
          <div className="table-row table-head" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr', gap: '16px' }}>
            <div>Name</div>
            <div>Role</div>
            <div>Status</div>
            <div>Projects</div>
          </div>
          {members.length > 0 ? members.map((u) => (
            <div key={u.id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#fff' }}>{u.name}</div>
              <div>{u.role}</div>
              <div><span className={`status-pill status-${(u.status || 'active').toLowerCase()}`}>{u.status || 'Active'}</span></div>
              <div>{projectsByOwner(u.name)}</div>
            </div>
          )) : <p style={{ color: 'var(--text-muted)', padding: '16px' }}>No members in this department yet.</p>}
        </div>
      </div>

      <div className="panel-card">
        <p className="eyebrow">Submitted Projects</p>
        <div className="activity-list" style={{ marginTop: '16px' }}>
          {deptProjects.length > 0 ? deptProjects.map((proj) => (
            <div key={proj.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>{proj.title}</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  By {proj.owner} · Status: {proj.status} · Rating: {proj.rating}
                </p>
              </div>
            </div>
          )) : <p style={{ color: 'var(--text-muted)', margin: 0 }}>No projects submitted by this department yet.</p>}
        </div>
      </div>
    </section>
  );
}
