export default function FeedbackTab({ feedbacks }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Bug Reports & Feedback</p>
          <h2>Review submitted suggestions and bug reports</h2>
        </div>
      </div>
      <div className="list-card">
        {feedbacks.map((item) => (
          <div key={item.user} className="list-item">
            <div>
              <strong>{item.user}</strong>
              <p>{item.message}</p>
            </div>
            <span className="status-pill status-info">{item.type}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
