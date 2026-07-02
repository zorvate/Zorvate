import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export interface PortfolioProjectData {
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url?: string | null;
  image?: string | null;
  technologies?: string[] | null;
}

type Props = {
  project: PortfolioProjectData;
};

const techTags: Record<string, string[]> = {
  "saas-dashboard": ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
  "agency-website": ["Next.js", "Framer Motion", "Tailwind CSS", "SEO"],
  "client-portal": ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
};

const demoLinks: Record<string, { live: string; github: string }> = {
  "saas-dashboard": { live: "https://demo.zorvate.com/dashboard", github: "https://github.com/zorvate/saas-dashboard" },
  "agency-website": { live: "https://demo.zorvate.com/agency", github: "https://github.com/zorvate/agency-website" },
  "client-portal": { live: "https://demo.zorvate.com/portal", github: "https://github.com/zorvate/client-portal" },
};

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function PortfolioCard({ project }: Props) {
  // Determine gradient fallback based on slug
  const bgGradients: Record<string, string> = {
    "saas-dashboard": "from-violet-600/30 via-indigo-600/10 to-background/50",
    "agency-website": "from-cyan-600/30 via-blue-600/10 to-background/50",
    "client-portal": "from-purple-600/30 via-pink-600/10 to-background/50",
  };
  const gradient = bgGradients[project.slug] || "from-primary/30 via-muted/10 to-background/50";
  const tags = (project.technologies && project.technologies.length > 0)
    ? project.technologies
    : (techTags[project.slug] || ["Next.js", "React"]);
  const links = demoLinks[project.slug] || { live: "#", github: "#" };

  return (
    <GlassCard
      glowColor="primary"
      tiltMaxAngle={6}
      className="h-full flex flex-col justify-between"
    >
      {/* Dynamic Abstract Visual Thumbnail */}
      <div className={`aspect-video w-full bg-gradient-to-br ${gradient} border-b relative flex items-center justify-center overflow-hidden`}>
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:10px_10px] opacity-60" />
        
        {/* Floating abstract decorative element inside thumbnail */}
        <div className="w-1/2 h-1/2 rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md relative z-10 flex flex-col justify-between p-3 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
          <div className="flex justify-between items-center">
            <span className="w-6 h-1.5 rounded-full bg-white/20" />
            <span className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <ExternalLink size={8} />
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="w-12 h-1.5 rounded bg-white/20" />
            <div className="w-full h-1 rounded bg-white/10" />
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>

          <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
            {project.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {/* Tech Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors"
          >
            Case Study <ArrowRight size={14} />
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
              title="GitHub Repository"
            >
              <GithubIcon size={15} />
            </a>
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-all"
              title="Live Demo"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}