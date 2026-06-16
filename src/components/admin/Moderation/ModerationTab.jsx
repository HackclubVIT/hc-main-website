export default function ModerationTab() {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Content Moderation</p>
          <h2>Check reported items and enforce community standards</h2>
        </div>
      </div>
      <div className="cards-grid">
        <div className="panel-card">
          <p className="eyebrow">Reports Open</p>
          <h3>14</h3>
        </div>
        <div className="panel-card card-accent">
          <p className="eyebrow">Actions Taken</p>
          <h3>52</h3>
        </div>
      </div>
    </section>
  )
}
