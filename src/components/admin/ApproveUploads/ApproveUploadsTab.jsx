

export default function AdminApproveUploads({ uploads, setUploads }) {
  const updateStatus = (index, status) => {
    setUploads(uploads.map((u, i) => i === index ? { ...u, status } : u));
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Approve / Reject Uploads</p>
          <h2>Review incoming content before publishing</h2>
        </div>
      </div>
      <div className="list-card">
        {uploads.map((item, index) => (
          <div key={item.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong>{item.content}</strong>
                {item.status && <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>}
              </div>
              <p style={{ marginTop: '4px' }}>{item.author} · {item.date}</p>
            </div>
            <div className="list-actions">
              <button
                className="button button-outlined"
                type="button"
                style={{ padding: '8px 16px', color: '#ff5555', borderColor: '#ff5555' }}
                onClick={() => updateStatus(index, 'Rejected')}
              >
                Reject
              </button>
              <button
                className="button button-primary"
                type="button"
                style={{ padding: '8px 16px' }}
                onClick={() => updateStatus(index, 'Approved')}
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
