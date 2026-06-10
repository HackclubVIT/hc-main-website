import styles from "./ProjectFilters.module.css";

const FILTERS = [
  "ALL", "WEB", "MOBILE", "AI/ML", "DEVOPS", "DESIGN", "OPEN SOURCE", "ONGOING", "COMPLETED"
];

const STATUS_FILTERS = ["NEWEST", "TOP RATED", "MOST LIKED", "A-Z"];

export default function ProjectFilters({ active, setActive, activeSort, setActiveSort }) {
  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersRow}>
        {/* Category pills */}
        <div className={styles.pillGroup}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.pill} ${active === f ? styles.pillActive : ""}`}
              onClick={() => setActive(f)}
            >
              {active === f && <span className={styles.pillDot} />}
              {f}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Sort pills */}
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>SORT</span>
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`${styles.sortPill} ${activeSort === s ? styles.sortPillActive : ""}`}
              onClick={() => setActiveSort(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Edge rule */}
      <div className={styles.edgeLine} />
    </div>
  );
}
