"use client";

import { useState } from "react";
import ProjectsHero from "../../components/projects/ProjectsHero";
import ProjectFilters from "../../components/projects/ProjectFilters";
import ProjectGrid from "../../components/projects/ProjectGrid";
import ProjectUploadModal from "../../components/projects/ProjectUploadModal";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState("NEWEST");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <main className="projects-root">
      <ProjectsHero
        onUpload={() => setUploadOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ProjectFilters
        active={activeFilter}
        setActive={setActiveFilter}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
      />
      <ProjectGrid filter={activeFilter} searchQuery={searchQuery} sort={activeSort} />
      {uploadOpen && (
        <ProjectUploadModal onClose={() => setUploadOpen(false)} />
      )}
    </main>
  );
}
