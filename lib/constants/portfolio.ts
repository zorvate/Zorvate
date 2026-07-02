export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    category: "Web Application",
    description:
      "A scalable SaaS dashboard built with Next.js, TypeScript, and Supabase.",
    image: "/images/portfolio/saas-dashboard.jpg",
  },
  {
    slug: "agency-website",
    title: "Agency Website",
    category: "Marketing Website",
    description:
      "A high-converting agency website focused on SEO and lead generation.",
    image: "/images/portfolio/agency-website.jpg",
  },
  {
    slug: "client-portal",
    title: "Client Portal",
    category: "Business System",
    description:
      "A secure client portal with project tracking, files, and messaging.",
    image: "/images/portfolio/client-portal.jpg",
  },
];