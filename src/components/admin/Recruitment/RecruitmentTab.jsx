import { useState, useEffect } from 'react';
import { api } from '../../../api';
import { HACKCLUB_DEPARTMENTS } from '../../../data/departments';

export default function RecruitmentTab({ 
  applications = [], 
  setApplications, 
  users = [], 
  setUsers 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  const refreshApplications = async () => {
    setIsRefreshing(true);
    try {
      const apps = await api.getRecruitmentApplications();
      if (Array.isArray(apps) && setApplications) {
        setApplications(apps);
      }
    } catch (err) {
      console.warn('Could not refresh recruitment applications:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshApplications();
  }, []);

  const filteredApplicants = applications.filter((app) => {
    // Exclude test records
    const isTest = 
      app.registerNumber === '24BPS1029' || 
      app.registerNumber === '24BYB1097' || 
      app.registerNumber === '24BCE9999' ||
      app.name === 'Armaan sangwan' ||
      app.name === 'Ivan George' ||
      app.name === 'Prachi khandelwal';
    if (isTest) return false;

    const matchesSearch = 
      (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (app.registerNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.firstPreference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.secondPreference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.domain || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDomain = 
      selectedDomain === 'All' || 
      app.firstPreference === selectedDomain || 
      app.secondPreference === selectedDomain || 
      app.domain === selectedDomain;

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplicants.map(a => a.id));
    }
  };

  const handleBatchStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to change ${selectedIds.length} candidate(s) to "${newStatus}"?`)) return;

    setIsBatchUpdating(true);
    try {
      await api.batchUpdateRecruitmentStatus(selectedIds, newStatus);
      setApplications(prev => prev.map(a => selectedIds.includes(a.id) ? { ...a, status: newStatus } : a));
      
      if (newStatus === 'Accepted') {
        const syncData = await api.getData();
        if (syncData.users) setUsers(syncData.users);
      }

      setSelectedIds([]);
      window.alert(`Successfully updated ${selectedIds.length} candidate(s) to "${newStatus}".`);
    } catch (err) {
      window.alert(err.message || 'Failed to update batch status.');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredApplicants.length === 0) {
      window.alert('No applicants to export.');
      return;
    }

    const headers = [
      'Name', 'Register Number', 'Email', 'Phone', '1st Preference', 'Why 1st Preference',
      '2nd Preference', 'Why 2nd Preference', 'Year', 'Status', 'GitHub', 'LinkedIn',
      'Portfolio', '7-Day Build', 'Skill to Learn', 'Why HackClub', 'Applied Date'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredApplicants.map(a => [
      escapeCsv(a.name),
      escapeCsv(a.registerNumber),
      escapeCsv(a.email),
      escapeCsv(a.phoneNumber),
      escapeCsv(a.firstPreference || a.domain),
      escapeCsv(a.firstPrefReason || a.whyJoin),
      escapeCsv(a.secondPreference),
      escapeCsv(a.secondPrefReason),
      escapeCsv(a.yearOfStudy),
      escapeCsv(a.status),
      escapeCsv(a.github),
      escapeCsv(a.linkedin),
      escapeCsv(a.portfolio),
      escapeCsv(a.sevenDaysBuild || a.projectDetails),
      escapeCsv(a.skillToLearn),
      escapeCsv(a.whyHackclub),
      escapeCsv(a.appliedDate)
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hackclub_recruitment_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.updateRecruitmentApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      
      if (newStatus === 'Accepted') {
        const syncData = await api.getData();
        if (syncData.users) setUsers(syncData.users);
        if (syncData.recruitmentApplications) setApplications(syncData.recruitmentApplications);
      }

      if (selectedApplicant && selectedApplicant.id === appId) {
        setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      window.alert(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplicant = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this applicant?')) return;
    try {
      await api.deleteRecruitmentApplication(appId);
      setApplications(prev => prev.filter(a => a.id !== appId));
      if (selectedApplicant && selectedApplicant.id === appId) {
        setSelectedApplicant(null);
      }
    } catch (err) {
      window.alert(err.message || 'Failed to delete application.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all recruitment applications?')) return;
    try {
      await api.clearAllRecruitmentApplications();
      if (setApplications) setApplications([]);
    } catch (err) {
      window.alert(err.message || 'Failed to clear applications.');
    }
  };

  const stats = {
    total: filteredApplicants.length,
    pending: filteredApplicants.filter(a => a.status === 'Pending').length,
    underReview: filteredApplicants.filter(a => a.status === 'Under Review').length,
    shortlisted: filteredApplicants.filter(a => a.status === 'Shortlisted').length,
    accepted: filteredApplicants.filter(a => a.status === 'Accepted').length,
    rejected: filteredApplicants.filter(a => a.status === 'Rejected').length,
  };

  return (
    <section className="panel-section" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Recruitment Applications</h2>
          <p className="subtitle">Review candidate profiles, filter by technical domains, and accept new makers into the club.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="button button-outlined"
            onClick={handleExportCsv}
            style={{ fontSize: '0.85rem', padding: '8px 14px', borderColor: 'var(--blue)', color: 'var(--blue)' }}
          >
            📥 Export CSV
          </button>
          <button 
            className="button button-outlined"
            onClick={refreshApplications}
            disabled={isRefreshing}
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh List'}
          </button>
          {applications.length > 0 && (
            <button 
              className="button button-outlined"
              onClick={handleClearAll}
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.85rem', padding: '8px 14px' }}
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Analytics Overview Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.total}</div>
        </div>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center', borderBottom: '3px solid var(--orange)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--orange)' }}>{stats.pending}</div>
        </div>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center', borderBottom: '3px solid var(--amber)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Under Review</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--amber)' }}>{stats.underReview}</div>
        </div>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center', borderBottom: '3px solid var(--blue)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shortlisted</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--blue)' }}>{stats.shortlisted}</div>
        </div>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center', borderBottom: '3px solid var(--success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accepted (Allowed)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.accepted}</div>
        </div>
        <div className="panel-card" style={{ padding: '14px', textAlign: 'center', borderBottom: '3px solid var(--danger)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rejected</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.rejected}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
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
            <option value="All">All Departments</option>
            {HACKCLUB_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
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
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button 
          className="button button-outlined"
          onClick={handleSelectAll}
          style={{ fontSize: '0.85rem', padding: '9px 14px' }}
        >
          {selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0 ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Batch Actions Bar (when candidates are selected) */}
      {selectedIds.length > 0 && (
        <div className="panel-card" style={{ padding: '12px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
            ✓ {selectedIds.length} candidate(s) selected
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="button button-outlined"
              onClick={() => handleBatchStatus('Shortlisted')}
              disabled={isBatchUpdating}
              style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'var(--blue)', color: 'var(--blue)' }}
            >
              Shortlist Selected
            </button>
            <button 
              className="button button-filled"
              onClick={() => handleBatchStatus('Accepted')}
              disabled={isBatchUpdating}
              style={{ fontSize: '0.8rem', padding: '6px 12px', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
            >
              Accept & Auto-Allow Selected
            </button>
            <button 
              className="button button-outlined"
              onClick={() => handleBatchStatus('Rejected')}
              disabled={isBatchUpdating}
              style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              Reject Selected
            </button>
          </div>
        </div>
      )}

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
                transition: 'transform 0.2s, border-color 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(app.id)}
                    onChange={(e) => handleToggleSelect(app.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--orange)' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,68,68,0.12)', 
                      color: 'var(--orange)', 
                      border: '1px solid rgba(255,68,68,0.25)',
                      fontWeight: '600'
                    }}>
                      1st: {app.firstPreference || app.domain}
                    </span>
                    {app.secondPreference && app.secondPreference !== 'None' && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: 'rgba(255,255,255,0.04)', 
                        color: 'var(--text-muted)', 
                        border: '1px solid rgba(255,255,255,0.08)' 
                      }}>
                        2nd: {app.secondPreference}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                  <button
                    title="Delete applicant"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteApplicant(app.id);
                    }}
                    style={{
                      background: 'rgba(255,68,68,0.1)',
                      border: '1px solid rgba(255,68,68,0.3)',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      padding: '3px 8px',
                      fontSize: '0.8rem',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                  >
                    🗑️
                  </button>
                </div>
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
                <p className="eyebrow" style={{ color: 'var(--orange)', fontFamily: 'monospace', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>1st Pref: <strong>{selectedApplicant.firstPreference || selectedApplicant.domain}</strong></span>
                  {selectedApplicant.secondPreference && selectedApplicant.secondPreference !== 'None' && (
                    <span>• 2nd Pref: <strong>{selectedApplicant.secondPreference}</strong></span>
                  )}
                </p>
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

            {/* Contact & Links Grid */}
            <div className="two-col-grid" style={{ gap: '24px', marginBottom: '20px' }}>
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
                    <a href={selectedApplicant.github.startsWith('http') ? selectedApplicant.github : `https://${selectedApplicant.github}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: 'var(--highlight)', textDecoration: 'none' }}>
                      {selectedApplicant.github} ↗
                    </a>
                  </div>
                )}
                {selectedApplicant.linkedin && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LinkedIn</span>
                    <a href={selectedApplicant.linkedin.startsWith('http') ? selectedApplicant.linkedin : `https://${selectedApplicant.linkedin}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: 'var(--highlight)', textDecoration: 'none' }}>
                      {selectedApplicant.linkedin} ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Department Motivation Section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,68,68,0.03)', border: '1px solid rgba(255,68,68,0.1)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--orange)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 'bold' }}>
                  🎯 1st Preference ({selectedApplicant.firstPreference || selectedApplicant.domain}):
                </span>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                  {selectedApplicant.firstPrefReason || selectedApplicant.whyJoin || 'N/A'}
                </p>
              </div>

              {selectedApplicant.secondPreference && selectedApplicant.secondPreference !== 'None' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 'bold' }}>
                    🎯 2nd Preference ({selectedApplicant.secondPreference}):
                  </span>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>
                    {selectedApplicant.secondPrefReason || 'No specific reason given.'}
                  </p>
                </div>
              )}
            </div>

            {/* Goals & Thinking Section */}
            {(selectedApplicant.skillToLearn || selectedApplicant.whyHackclub || selectedApplicant.productiveWebsiteQuestions) && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--orange)' }}>🧠 Goals & Thinking</h3>

                {selectedApplicant.skillToLearn && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      🛠️ Skill wanted to learn & why:
                    </span>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                      {selectedApplicant.skillToLearn}
                    </p>
                  </div>
                )}

                {selectedApplicant.whyHackclub && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      ❓ Why HackClub:
                    </span>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                      {selectedApplicant.whyHackclub}
                    </p>
                  </div>
                )}

                {selectedApplicant.productiveWebsiteQuestions && (
                  <div style={{ background: 'rgba(255,68,68,0.02)', border: '1px solid rgba(255,68,68,0.08)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      💡 Scenario: Questions asked before building student productivity website:
                    </span>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                      {selectedApplicant.productiveWebsiteQuestions}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedApplicant.projectDetails && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'grid', gap: '14px', marginBottom: '32px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Project Details</span>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>{selectedApplicant.projectDetails}</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              <button 
                className="button button-outlined"
                disabled={updatingId !== null}
                onClick={() => setSelectedApplicant(null)}
              >
                Close
              </button>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  className="button button-outlined"
                  onClick={() => handleDeleteApplicant(selectedApplicant.id)}
                  style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginRight: 'auto' }}
                >
                  🗑️ Delete Application
                </button>
                {selectedApplicant.status !== 'Pending' && (
                  <button 
                    className="button button-secondary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Pending')}
                  >
                    Reset to Pending
                  </button>
                )}
                {selectedApplicant.status !== 'Under Review' && (
                  <button 
                    className="button button-secondary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Under Review')}
                  >
                    Set Under Review
                  </button>
                )}
                {selectedApplicant.status !== 'Shortlisted' && (
                  <button 
                    className="button button-outlined"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Shortlisted')}
                    style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
                  >
                    Shortlist
                  </button>
                )}
                {selectedApplicant.status !== 'Rejected' && (
                  <button 
                    className="button button-secondary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Rejected')}
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    Reject
                  </button>
                )}
                {selectedApplicant.status !== 'Accepted' && (
                  <button 
                    className="button button-primary"
                    disabled={updatingId !== null}
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Accepted')}
                    style={{ backgroundColor: 'var(--success)', color: '#fff', borderColor: 'var(--success)' }}
                  >
                    {updatingId === selectedApplicant.id ? 'Promoting...' : 'Accept & Promote'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
