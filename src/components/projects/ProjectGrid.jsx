import { useState, useMemo } from "react";
import { PROJECTS } from "../../lib/mockProjects";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({ filter, searchQuery, sort }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());

  const filtered = useMemo(() => {
    const results = PROJECTS.filter(p => {
      const matchesFilter = filter === "ALL" || p.category === filter || p.status.toUpperCase() === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.members.some(m => m.name.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });

    // Apply sort
    switch (sort) {
      case "TOP RATED":
        return [...results].sort((a, b) => b.rating - a.rating);
      case "MOST LIKED":
        return [...results].sort((a, b) => b.likes - a.likes);
      case "A-Z":
        return [...results].sort((a, b) => a.title.localeCompare(b.title));
      case "NEWEST":
      default:
        return [...results].sort((a, b) => parseInt(b.id.replace("p","")) - parseInt(a.id.replace("p","")));
    }
  }, [filter, searchQuery, sort]);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className={styles.gridSection}>
      {/* Section label */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>RESULTS: </span>
        <span className={styles.sectionCount}>
          {filtered.length} PROJECT{filtered.length !== 1 ? "S" : ""}
        </span>
        <div className={styles.sectionLine} />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyGlyph}>∅</span>
          <p>No projects match your search.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              liked={likedIds.has(project.id)}
              onLike={e => toggleLike(project.id, e)}
              onClick={() => setSelectedProject(project)}
            />
          ))}

          {/* Featured spacer card */}
          <div className={styles.addCard} onClick={() => {}}>
            <div className={styles.addCardInner}>
            </div>
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          liked={likedIds.has(selectedProject.id)}
          onLike={e => toggleLike(selectedProject.id, e)}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
