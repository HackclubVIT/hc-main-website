

import { useState } from 'react';

export default function AdminManageProjects({ projects, setProjects }) {
  const [editRatingId, setEditRatingId] = useState(null);
  const [editRatingValue, setEditRatingValue] = useState('');

  const handleRatingSubmit = (id) => {
    let parsed = parseFloat(editRatingValue);
    if (isNaN(parsed) || parsed < 0) parsed = 0;
    if (parsed > 10) parsed = 10;
    setProjects(projects.map(p => p.id === id ? { ...p, rating: parsed.toFixed(1) } : p));
    setEditRatingId(null);
  };
  const setProjectStatus = (id, newStatus) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const deleteProject = (id) => {
    if(window.confirm('Are you sure you want to delete this project permanently?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Manage Projects</p>
          <h2>Project status, review, and publish control</h2>
        </div>
      </div>
      <div className="table-card">
        <div className="table-row table-head grid-col-projects">
          <div>Project</div>
          <div>Owner</div>
          <div>Status</div>
          <div>Rating</div>
          <div>Actions</div>
        </div>
        {projects.map((project) => (
          <div key={project.id} className="table-row grid-col-projects" style={{ alignItems: 'center' }}>
            <div>
              <strong>{project.title}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.technologiesUsed?.join(', ')}</div>
            </div>
            <div>{project.owner}</div>
            <div><span className={`status-pill status-${project.status.toLowerCase()}`}>{project.status}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {editRatingId === project.id ? (
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="10" 
                  value={editRatingValue} 
                  onChange={(e) => setEditRatingValue(e.target.value)}
                  onBlur={() => handleRatingSubmit(project.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRatingSubmit(project.id)}
                  autoFocus
                  style={{ width: '60px', padding: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                />
              ) : (
                <span 
                  onClick={() => { setEditRatingId(project.id); setEditRatingValue(project.rating); }}
                  style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(255,255,255,0.4)', paddingBottom: '2px' }}
                  title="Click to edit rating"
                >
                  {project.rating} ⭐
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Pending', 'Review', 'Draft'].includes(project.status) ? (
                <>
                  <button 
                    className="button button-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }} 
                    onClick={() => setProjectStatus(project.id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="button button-outlined" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff5555', borderColor: '#ff5555' }} 
                    onClick={() => setProjectStatus(project.id, 'Rejected')}
                  >
                    Reject
                  </button>
                </>
              ) : project.status === 'Approved' || project.status === 'Published' ? (
                <button 
                  className="button button-outlined" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }} 
                  onClick={() => setProjectStatus(project.id, 'Pending')}
                >
                  Unpublish
                </button>
              ) : project.status === 'Rejected' ? (
                <button 
                  className="button button-outlined" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }} 
                  onClick={() => setProjectStatus(project.id, 'Pending')}
                >
                  Restore
                </button>
              ) : null}
              <button 
                className="button button-outlined" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff5555', borderColor: 'transparent', background: 'rgba(255,85,85,0.1)' }} 
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
