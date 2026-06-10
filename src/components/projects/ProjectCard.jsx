import { useEffect, useRef } from "react";
import styles from "./ProjectCard.module.css";

const BG_PATTERNS = {
  neural: (color) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g)"/>
      ${Array.from({length:12}, (_,i) => {
        const cx = 40 + (i * 30) % 360, cy = 30 + (i * 25) % 260;
        return `<circle cx="${cx}" cy="${cy}" r="3" fill="${color}" opacity="0.4"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + 60}" y2="${cy + 40}" stroke="${color}" stroke-opacity="0.15" stroke-width="1"/>`;
      }).join('')}
    </svg>`,
  grid: (color) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${color}" stroke-opacity="0.2" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#p)"/>
      <rect width="400" height="300" fill="${color}" opacity="0.08"/>
    </svg>`,
  dots: (color) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="d" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="${color}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#d)"/>
      <rect width="400" height="300" fill="${color}" opacity="0.05"/>
    </svg>`,
  lines: (color) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length:10}, (_,i) => `
        <line x1="0" y1="${i*30}" x2="400" y2="${i*30+60}" stroke="${color}" stroke-opacity="0.15" stroke-width="1"/>
      `).join('')}
      <rect width="400" height="300" fill="${color}" opacity="0.06"/>
    </svg>`,
};

export default function ProjectCard({ project, index, liked, onLike, onClick }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const svgBg = BG_PATTERNS[project.bgPattern]?.(project.accentColor) || BG_PATTERNS.grid(project.accentColor);
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svgBg)}`;

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${project.featured ? styles.featured : ""}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={onClick}
    >
      {/* Mouse-follow shimmer */}
      <div className={styles.shimmer} />

      {/* Card background pattern */}
      <div
        className={styles.cardBg}
        style={{ backgroundImage: `url("${svgUrl}")` }}
      />

      {/* Accent edge */}
      <div className={styles.accentEdge} style={{ background: project.accentColor }} />

      {/* Featured badge */}
      {project.featured && (
        <div className={styles.featuredBadge}>
          <span className={styles.featuredDot} />
          FEATURED
        </div>
      )}

      {/* Status badge */}
      <div className={`${styles.statusBadge} ${project.status === "Ongoing" ? styles.ongoing : styles.completed}`}>
        {project.status.toUpperCase()}
      </div>

      {/* Project number */}
      <span className={styles.projectNumber}>
        {String(parseInt(project.id.replace("p", ""))).padStart(3, "0")}.
      </span>

      {/* Content */}
      <div className={styles.content}>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.description}>{project.description}</p>

        {/* Tags */}
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {/* Members */}
        <div className={styles.members}>
          {project.members.slice(0, 3).map((m, i) => (
            <div
              key={m.name}
              className={styles.avatar}
              title={m.name}
              style={{
                zIndex: project.members.length - i,
                background: `hsl(${i * 60 + 10}, 50%, 30%)`,
              }}
            >
              {m.avatar}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className={`${styles.avatar} ${styles.avatarMore}`}>
              +{project.members.length - 3}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Like button */}
          <button
            className={`${styles.actionBtn} ${liked ? styles.liked : ""}`}
            onClick={onLike}
            title="Like project"
          >
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span>{project.likes + (liked ? 1 : 0)}</span>
          </button>

          {/* Rating */}
          <div className={styles.rating}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>{project.rating}</span>
          </div>

          {/* GitHub link */}
          <a
            href={project.github}
            className={styles.actionBtn}
            onClick={e => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            title="View repository"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          {/* Demo link */}
          {project.demo && (
            <a
              href={project.demo}
              className={styles.actionBtn}
              onClick={e => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              title="Live demo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
