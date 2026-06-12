import { useState } from 'react';

export default function AdminRatingsManagement({ projects, setProjects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const removeRating = (projectId, ratingUser) => {
    if (window.confirm(`Are you sure you want to remove the rating from ${ratingUser}?`)) {
      setProjects(projects.map(p => {
        if (p.id === projectId) {
          const newRatings = p.individualRatings.filter(r => r.user !== ratingUser);
          const newAvg = newRatings.length > 0 
            ? (newRatings.reduce((acc, r) => acc + r.rating, 0) / newRatings.length).toFixed(1) 
            : 0;
          return { ...p, individualRatings: newRatings, rating: newAvg };
        }
        return p;
      }));
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProj = projects.find(p => p.id === projectId);
        const newRatings = updatedProj.individualRatings.filter(r => r.user !== ratingUser);
        const newAvg = newRatings.length > 0 
          ? (newRatings.reduce((acc, r) => acc + r.rating, 0) / newRatings.length).toFixed(1) 
          : 0;
        setSelectedProject({ ...updatedProj, individualRatings: newRatings, rating: newAvg });
      }
    }
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Ratings Management</p>
          <h2>Inspect and monitor project ratings</h2>
        </div>
      </div>
      
      <div className="table-card">
        <div className="table-row table-head grid-col-ratings">
          <div>Project</div>
          <div>Current Avg Rating</div>
          <div>Total Ratings</div>
          <div>Actions</div>
        </div>
        {projects.map((project) => (
          <div key={project.id} className="table-row grid-col-ratings" style={{ alignItems: 'center' }}>
            <div>{project.title}</div>
            <div>{project.rating} ⭐</div>
            <div>{project.individualRatings ? project.individualRatings.length : 0} reviews</div>
            <div>
              <button 
                className="button button-outlined" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setSelectedProject(project)}
              >
                Inspect Ratings
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ratings for: {selectedProject.title}</h2>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Current Average: <strong>{selectedProject.rating} ⭐</strong></p>
              <div className="list-card" style={{ marginTop: '16px' }}>
                {selectedProject.individualRatings && selectedProject.individualRatings.length > 0 ? (
                  selectedProject.individualRatings.map((rating, i) => (
                    <div key={i} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{rating.user}</strong>
                        <p>{rating.rating} ⭐ - "{rating.comment}"</p>
                      </div>
                      <button 
                        className="button button-outlined" 
                        style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#ff5555', borderColor: '#ff5555' }}
                        onClick={() => removeRating(selectedProject.id, rating.user)}
                      >
                        Remove Fake Rating
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No ratings yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
