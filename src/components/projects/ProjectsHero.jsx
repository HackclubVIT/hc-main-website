import { useEffect, useRef, useState } from "react";
import styles from "./ProjectsHero.module.css";

export default function ProjectsHero({ onUpload, searchQuery, setSearchQuery }) {
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Ambient red orb */}
      <div className={styles.orb} />
      <div className={styles.orbRight} />

      {/* Scanline */}
      <div className={styles.scanline} />

      {/* Top bar */}
      <div className={styles.topBar}>
        <span className={styles.topLabel}>HC — PROJECT MODULE</span>
        <div className={styles.topRight}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>LIVE SUBMISSIONS</span>
        </div>
      </div>

      {/* Main hero content */}
      <div className={styles.heroContent}>
        <div className={`${styles.tagline} ${mounted ? styles.show : ""}`}>
          <span className={styles.taglineBar} />
          EXPLORE · BUILD · SUBMIT
          <span className={styles.taglineBar} />
        </div>

        <h1 className={`${styles.title} ${mounted ? styles.show : ""}`}>
          <span className={styles.titleSmall}>THE</span>
          <span className={styles.titleBig}>PROJECTS</span>
          <em className={styles.titleSub}>vault.</em>
        </h1>

        <p className={`${styles.heroQuote} ${mounted ? styles.show : ""}`}>
          Code runs in silence — until it doesn't.
        </p>

        {/* Search bar */}
        <div className={`${styles.searchWrap} ${mounted ? styles.show : ""}`}>
          <div className={styles.searchInner}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder="search by title, tech, member..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>
        </div>

        {/* CTA row */}
        <div className={`${styles.ctaRow} ${mounted ? styles.show : ""}`}>
          <button className={styles.uploadBtn} onClick={onUpload}>
            <span className={styles.uploadBtnInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              UPLOAD PROJECT
            </span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className={`${styles.statsRow} ${mounted ? styles.show : ""}`}>
        {[
          { label: "PROJECTS", value: "124" },
          { label: "CONTRIBUTORS", value: "38" },
          { label: "TECH STACKS", value: "47" },
          { label: "ONGOING", value: "12" },
        ].map((stat, i) => (
          <div key={stat.label} className={styles.statCard} style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom edge line */}
      <div className={styles.heroEdge} />
    </section>
  );
}
