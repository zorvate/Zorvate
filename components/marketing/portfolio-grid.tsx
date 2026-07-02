"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioCard, PortfolioProjectData } from "./portfolio-card";

const categories = ["All", "Web Application", "Marketing Website", "Business System"];

export function PortfolioGrid({ initialProjects = [] }: { initialProjects: PortfolioProjectData[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? initialProjects
    : initialProjects.filter((p) => p.category === activeCategory);

  // Bento span mappings based on slug
  const bentoSpans: Record<string, string> = {
    "saas-dashboard": "md:col-span-2",
    "agency-website": "md:col-span-1",
    "client-portal": "md:col-span-3",
  };

  return (
    <div className="space-y-12">
      {/* Segmented Glass Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-1.5 p-1.5 rounded-2xl border bg-card/45 backdrop-blur-md max-w-fit mx-auto shadow-sm select-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-xs font-bold rounded-xl relative transition-all duration-300 ${
              activeCategory === category
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeCategory === category && (
              <motion.span
                layoutId="activeFilterTrack"
                className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md shadow-primary/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {category === "All" ? "All Projects" : category}
          </button>
        ))}
      </div>

      {/* Projects Grid with AnimatePresence */}
      <motion.div layout className="grid gap-6 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: PortfolioProjectData) => {
            const span = bentoSpans[project.slug] || "md:col-span-1";
            return (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={span}
              >
                <PortfolioCard project={project} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
