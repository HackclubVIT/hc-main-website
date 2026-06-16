import { useState } from 'react';
import { api } from '../../../api';

export default function RecruitmentTab({ 
  applications = [], 
  setApplications, 
  users = [], 
  setUsers 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const filteredApplicants = applications.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDomain = selectedDomain === 'All' || app.domain === selectedDomain;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      // Call status update API
      await api.updateRecruitmentApplicationStatus(appId, newStatus);
      
      // Update local applications list
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      
      // If accepted, we can fetch all updated users from the database to sync the list
      const syncData = await api.getData();
      if (syncData.users) setUsers(syncData.users);
      if (syncData.recruitmentApplications) setApplications(syncData.recruitmentApplications);

      if (selectedApplicant && selectedApplicant.id === appId) {
        setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      window.alert(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="panel-section" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Recruitment Applications</h2>
          <p className="subtitle">Review candidate profiles, filter by technical domains, and accept new makers into the club.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel-card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, register number, or email..."
            style={{ width: '100%', padding: '10px 14px' }}
          />
        </div>

        <div>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Domains</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="Systems & IoT">Systems & IoT</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Content & Social Media">Content & Social Media</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="All">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Grid of applicants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((app) => (
            <div 
              key={app.id} 
              className="panel-card applicant-card" 
              onClick={() => setSelectedApplicant(app)}
              style={{ 
                padding: '24px', 
                borderLeft: `4px solid ${app.status === 'Accepted' ? 'var(--success)' : app.status === 'Rejected' ? 'var(--danger)' : 'var(--orange)'}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="eyebrow" style={{ color: 'var(--orange)', fontFamily: 'monospace' }}>{app.domain}</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: app.status === 'Accepted' ? 'rgba(46,125,50,0.15)' : app.status === 'Rejected' ? 'rgba(172,18,12,0.15)' : 'rgba(208,125,34,0.15)',
                  color: app.status === 'Accepted' ? '#81c784' : app.status === 'Rejected' ? '#e57373' : '#ffb74d',
                  border: `1px solid ${app.status === 'Accepted' ? 'var(--success)' : app.status === 'Rejected' ? 'var(--danger)' : 'var(--amber)'}`
                }}>
                  {app.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem' }}>{app.name}</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                {app.registerNumber} • {app.yearOfStudy} Year
              </p>

              <div style={{ fontSize: '0.85rem', color: 'var(--mute)', display: 'grid', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📧</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.email}</span>
                </div>
                {app.github && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💻</span> <span style={{ color: 'var(--highlight)' }}>{app.github.replace('github.com/', '')}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="panel-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No applicants found matching filters.
          </div>
        )}
      </div>

      {/* Details modal */}
      {selectedApplicant && (
        <div className="modal-backdrop" onClick={() => setSelectedApplicant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '100%', padding: '32px', border: '1px solid rgba(255,68,68,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <p className="eyebrow" style={{ color: 'var(--orange)', fontFamily: 'monospace' }}>{selectedApplicant.domain} Applicant</p>
                <h2 style={{ fontSize: '1.8rem', marginTop: '6px' }}>{selectedApplicant.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px' }}>
                  {selectedApplicant.registerNumber} • {selectedApplicant.yearOfStudy} Year • Applied {selectedApplicant.appliedDate}
                </p>
              </div>
              <button 
                onClick={() => setSelectedApplicant(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div className="two-col-grid" style={{ gap: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                  <span style={{ fontSize: '0.95rem' }}>{selectedApplicant.email}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
                  <span style={{ fontSize: '0.95rem' }}>{selectedApplicant.phoneNumber || 'N/A'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedApplicant.github && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GitHub</span>
                    <a href={`https://${selectedApplicant.github}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: 'var(--highlight)', textDecoration: 'none' }}>
                      {selectedApplicant.github} ↗
                    </a>
                  </div>
                )}
                {selectedApplicant.linkedin && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LinkedIn</span>
                    <a href={`https://${selectedApplicant.linkedin}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: 'var(--highlight)', textDecoration: 'none' }}>
                      {selectedApplicant.linkedin} ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'grid', gap: '20px', marginBottom: '32px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Why join HackClub?</span>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>
                  {selectedApplicant.whyJoin}
                </p>
              </div>

              {selectedApplicant.projectDetails && (
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Project description / proposal</span>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>
                    {selectedApplicant.projectDetails}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              <button 
                className="button button-outlined"
                disabled={updatingId !== null}
                onClick={() => setSelectedApplicant(null)}
              >
                Close
              </button>
              
              {selectedApplicant.status === 'Pending' && (
                <>
                  <button 
                    className="button button-secondary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Rejected')}
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    {updatingId === selectedApplicant.id ? 'Updating...' : 'Reject'}
                  </button>
                  <button 
                    className="button button-primary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Accepted')}
                    style={{ backgroundColor: 'var(--success)', color: '#fff', borderColor: 'var(--success)' }}
                  >
                    {updatingId === selectedApplicant.id ? 'Promoting...' : 'Accept & Promote'}
                  </button>
                </>
              )}

              {selectedApplicant.status !== 'Pending' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Processed:</span>
                  <strong style={{ color: selectedApplicant.status === 'Accepted' ? '#81c784' : '#e57373' }}>
                    {selectedApplicant.status}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
