import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PortfolioProjectData {
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url?: string | null;
  image?: string | null;
  technologies?: string[] | null;
}

type Props = { project: PortfolioProjectData; };

const techTags: Record<string, string[]> = {
  "saas-dashboard": ["Next.js", "Supabase", "TypeScript", "Tailwind"],
  "agency-website": ["Next.js", "Framer Motion", "TypeScript"],
  "client-portal": ["Next.js", "Supabase", "PostgreSQL"],
};

const demoLinks: Record<string, { live: string; github: string }> = {
  "saas-dashboard": { live: "https://demo.zorvate.com/dashboard", github: "https://github.com/zorvate/saas-dashboard" },
  "agency-website": { live: "https://demo.zorvate.com/agency", github: "https://github.com/zorvate/agency-website" },
  "client-portal": { live: "https://demo.zorvate.com/portal", github: "https://github.com/zorvate/client-portal" },
};

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function PortfolioCard({ project }: Props) {
  const tags = project.technologies && project.technologies.length > 0 ? project.technologies : techTags[project.slug] || ["Next.js", "React"];
  const links = demoLinks[project.slug] || { live: "#", github: "#" };

  return (
    <div className="panel-shell flex h-full flex-col justify-between overflow-hidden">
      <div className="aspect-[16/10] w-full border-b border-border bg-surface-secondary p-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{project.category}</Badge>
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Case Study</span>
        </div>
        <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface/80 p-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
            <span>{project.slug}.sys</span>
            <span className="text-foreground">Live</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-6 p-6">
        <div className="space-y-3">
          <h3 className="text-base font-semibold tracking-tight text-foreground">{project.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground transition-colors hover:text-primary">
            Case Study <ArrowUpRight className="size-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground" title="Repository"><GithubIcon size={14} /></a>
            <a href={links.live} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground" title="Live Demo"><ExternalLink className="size-3.5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}