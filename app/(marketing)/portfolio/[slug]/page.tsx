import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PortfolioService } from "@/lib/backend/services/portfolio-service";
import PortfolioDetailClient from "./PortfolioDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await PortfolioService.getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.seo_title || `${project.title} | Zorvate Portfolio`,
    description: project.seo_description || project.description,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await PortfolioService.getProjectBySlug(slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  // Safely translate Date columns or custom types before passing to client component
  const projectPayload = {
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    technologies: project.technologies,
    challenge: project.challenge,
    solution: project.solution,
    testimonial_quote: project.testimonial_quote,
    testimonial_author: project.testimonial_author,
    testimonial_role: project.testimonial_role,
    metrics: project.metrics,
    process_steps: project.process_steps,
    client_name: project.client_name,
    project_date: project.project_date ? String(project.project_date) : null,
  };

  return <PortfolioDetailClient project={projectPayload} />;
}