import { useState } from 'react';
import { api } from '../../../api';

export default function EvaluateTab({ dashboardProjects, setDashboardProjects }) {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  const handleRate = async (projectId) => {
    const ratingVal = parseFloat(ratings[projectId]);
    const commentVal = comments[projectId] || '';

    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 10) {
      window.alert('Please enter a rating between 1 and 10.');
      return;
    }

    try {
      const res = await api.rateProject(projectId, ratingVal, commentVal);
      setDashboardProjects(prev => prev.map(p => p.id === projectId ? res.project : p));
      window.alert('Rating and evaluation submitted successfully!');
      
      // Reset local input states
      setRatings(prev => ({ ...prev, [projectId]: '' }));
      setComments(prev => ({ ...prev, [projectId]: '' }));
    } catch (err) {
      window.alert(err.message || 'Failed to submit rating.');
    }
  };

  // Only show projects that are Approved, Published or in Review status
  const evaluatableProjects = dashboardProjects.filter(p => 
    p.status === 'Approved' || p.status === 'Published' || p.status === 'Review'
  );

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Reviewer Portal</p>
          <h2>Evaluate and rate submitted projects</h2>
        </div>
      </div>
      <div className="list-card">
        {evaluatableProjects.length > 0 ? evaluatableProjects.map(project => (
          <div key={project.id} className="list-item" style={{ flexDirection: 'column', gap: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{project.title}</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                  Owner: {project.owner} · Current Avg Rating: {project.rating} ⭐ ({project.individualRatings?.length || 0} reviews)
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  {project.description || 'No description provided.'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px', width: '100%', maxWidth: '320px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', width: '90px' }}>Rating (1-10):</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    step="0.1"
                    placeholder="e.g. 9.5" 
                    value={ratings[project.id] || ''}
                    onChange={(e) => setRatings(prev => ({ ...prev, [project.id]: e.target.value }))}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'center', flex: 1 }} 
                  />
                </div>
                
                <textarea
                  rows="2"
                  placeholder="Leave constructive evaluation feedback..."
                  value={comments[project.id] || ''}
                  onChange={(e) => setComments(prev => ({ ...prev, [project.id]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                    color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical'
                  }}
                />

                <button 
                  className="button button-primary" 
                  onClick={() => handleRate(project.id)}
                  style={{ width: '100%', padding: '10px 0', fontSize: '0.9rem' }}
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        )) : <p style={{ color: 'var(--text-muted)' }}>No projects available for evaluation.</p>}
      </div>
    </section>
  );
}
