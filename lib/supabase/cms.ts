import { SupabaseClient } from "@supabase/supabase-js";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  display_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  display_order: number;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  display_order: number;
  featured?: boolean;
  status?: 'draft' | 'published';
  technologies?: string[] | null;
  challenge?: string | null;
  solution?: string | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  testimonial_role?: string | null;
  metrics?: { label: string; value: number; suffix: string }[] | null;
  process_steps?: { phase: string; title: string; desc: string }[] | null;
  client_name?: string | null;
  project_date?: string | null;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  display_order: number;
  status: 'open' | 'closed';
}

export interface SiteSetting {
  key: string;
  value: string;
  label: string;
}

// ==========================================
// FALLBACK DATA CONSTANTS
// ==========================================

export const MOCK_FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "What technologies do you use for development?",
    answer: "We build primarily with Next.js 15, TypeScript (under strict typing guidelines), Tailwind CSS v4, and Supabase for database integration. This ensures your project is secure, modern, and easily maintainable.",
    display_order: 0
  },
  {
    id: "faq-2",
    question: "How long does a typical SaaS project take to complete?",
    answer: "A standard Version 1 application normally takes between 4 to 8 weeks to build, test, and deploy. Custom workflows or complex integrations might extend this timeline.",
    display_order: 1
  },
  {
    id: "faq-3",
    question: "Can I manage projects and view invoices online?",
    answer: "Yes. Once you sign up, you get full access to the Client Portal. There, you can chat with the developer team, upload and view files, inspect the milestone timelines, and manage invoices.",
    display_order: 2
  },
  {
    id: "faq-4",
    question: "How is payment structured?",
    answer: "We typically charge a 50% deposit to initiate the planning/design phase, with the remaining 50% due upon production launch and handoff of the codebase.",
    display_order: 3
  },
  {
    id: "faq-5",
    question: "Do you offer post-launch support?",
    answer: "Yes, we offer monthly retainer packages to cover server maintenance, security patches, regular backups, and incremental feature updates.",
    display_order: 4
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Ammar Jaffri",
    role: "FinTech Founder",
    text: "The delivery of our client billing system was faster than expected. Zorvate's code architecture is incredibly clean.",
    rating: 5,
    display_order: 0
  },
  {
    id: "test-2",
    name: "Sarah Ahmed",
    role: "SaaS Builder",
    text: "We completely migrated our workspace toolset to Zorvate. The project dashboards are state-of-the-art and easy to scale.",
    rating: 5,
    display_order: 1
  },
  {
    id: "test-3",
    name: "Zainab Malik",
    role: "Product Director",
    text: "Performance, type-safety, and UX design are premium. They took complete ownership of our tech stack launch.",
    rating: 5,
    display_order: 2
  },
  {
    id: "test-4",
    name: "Usman Raza",
    role: "E-commerce COO",
    text: "The real-time workspace portal made tracking milestones extremely easy. Absolute professionals throughout.",
    rating: 5,
    display_order: 3
  }
];

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "team-1",
    name: "Ammar Jaffri",
    role: "Founder & CEO",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    display_order: 0
  },
  {
    id: "team-2",
    name: "Sarah Ahmed",
    role: "Lead Frontend Engineer",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    display_order: 1
  },
  {
    id: "team-3",
    name: "Zainab Malik",
    role: "Head of Design",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    display_order: 2
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "serv-1",
    slug: "saas-development",
    title: "SaaS Development",
    shortDescription: "Scalable SaaS platforms built with modern technologies.",
    description: "We build secure, scalable SaaS applications using Next.js, TypeScript, Supabase, and PostgreSQL.",
    features: ["Authentication", "Admin Dashboard", "Billing Ready", "Responsive UI", "Production Architecture"],
    display_order: 0
  },
  {
    id: "serv-2",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortDescription: "Modern interfaces focused on usability and conversion.",
    description: "From wireframes to polished interfaces, we design products that are intuitive and visually appealing.",
    features: ["Wireframing", "Prototyping", "Design Systems", "Accessibility", "Responsive Design"],
    display_order: 1
  },
  {
    id: "serv-3",
    slug: "full-stack-web-apps",
    title: "Full-Stack Web Apps",
    shortDescription: "Complete web applications from frontend to backend.",
    description: "Custom applications with modern frontend, backend, authentication, storage, and APIs.",
    features: ["Next.js", "Supabase", "API Integration", "Database Design", "Deployment"],
    display_order: 2
  }
];

export const MOCK_PORTFOLIO: PortfolioProject[] = [
  {
    id: "port-1",
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    category: "Web Application",
    description: "A scalable SaaS dashboard built with Next.js, TypeScript, and Supabase.",
    image_url: "/images/portfolio/saas-dashboard.jpg",
    display_order: 0,
    featured: true,
    status: "published",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
    challenge: "The client's legacy dashboard suffered from heavy bundle sizes, slow SQL querying times, and a dated visual style that led to user churn. They needed a state-of-the-art interface that felt immediate and secure.",
    solution: "We engineered a server-side-rendered Next.js core backed by a secure PostgreSQL database, optimized query caching, and automated billing callbacks via Stripe. We integrated fluid motion layers to keep users engaged.",
    testimonial_quote: "Zorvate completely transformed our visual product. The load speed dropped dramatically and our users love the dashboard.",
    testimonial_author: "Ammar Jaffri",
    testimonial_role: "CEO, FinTech SaaS Corp",
    metrics: [
      { label: "Platform Uptime", value: 99.99, suffix: "%" },
      { label: "Page Load Speed", value: 0.38, suffix: "s" },
      { label: "User Engagement", value: 145, suffix: "%" }
    ],
    process_steps: [
      { phase: "Phase 01", title: "Strategy & Interface Mapping", desc: "Mapped client profiles and set up security boundaries." },
      { phase: "Phase 02", title: "Visual Prototyping", desc: "Designed premium glassmorphic UI cards in Figma." },
      { phase: "Phase 03", title: "Dashboard Coding", desc: "Built the dashboard panels and real-time event updates." },
      { phase: "Phase 04", title: "Performance Tuning", desc: "Achieved sub-second page loads and compiled final bundles." }
    ],
    client_name: "FinTech SaaS Corp",
    project_date: "2025-06-15"
  },
  {
    id: "port-2",
    slug: "agency-website",
    title: "Agency Website",
    category: "Marketing Website",
    description: "A high-converting agency website focused on SEO and lead generation.",
    image_url: "/images/portfolio/agency-website.jpg",
    display_order: 1,
    featured: true,
    status: "published",
    technologies: ["Next.js", "React", "Tailwind CSS v4", "Framer Motion", "Netlify"],
    challenge: "A highly static online brochure that loaded slowly on mobile and failed to capture leads or drive user engagement. It lacked emotional appeal and failed to express the brand's premium identity.",
    solution: "We built a fully static Next.js export with Tailwind CSS v4 layout tokens, highly responsive fluid animations, and a structured Netlify deployment. We added interactive overlays and magnetic button hooks.",
    testimonial_quote: "Working with Zorvate was a game-changer. The conversion rate of our landing pages increased immediately.",
    testimonial_author: "Sarah Ahmed",
    testimonial_role: "Marketing VP, Creative Ltd",
    metrics: [
      { label: "Lighthouse Score", value: 100, suffix: "" },
      { label: "Lead Conversions", value: 320, suffix: "%" },
      { label: "Time-to-Interactive", value: 1.1, suffix: "s" }
    ],
    process_steps: [
      { phase: "Phase 01", title: "Brand Alignment", desc: "Defined color palettes, typography guidelines, and transition metrics." },
      { phase: "Phase 02", title: "Layout Protyping", desc: "Composed complex grid layouts with scroll indicators." },
      { phase: "Phase 03", title: "Animation Sprints", desc: "Implemented magnetic effects and particle canvas layers." },
      { phase: "Phase 04", title: "Deployment Audit", desc: "Validated responsive grid elements and metadata schemas." }
    ],
    client_name: "Creative Branding Ltd",
    project_date: "2025-08-20"
  },
  {
    id: "port-3",
    slug: "client-portal",
    title: "Client Portal",
    category: "Business System",
    description: "A secure client portal with project tracking, files, and messaging.",
    image_url: "/images/portfolio/client-portal.jpg",
    display_order: 2,
    featured: true,
    status: "published",
    technologies: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript", "WebSockets"],
    challenge: "Legacy file delivery processes relied on insecure email threads and manual sheets, creating operational bottleneck delays and exposing sensitive client documents.",
    solution: "Next.js App Router workspace coupled to a secure cloud storage container, real-time message tables, and multi-tenant admin levels. Documents are isolated using cryptographically secure user workspaces.",
    testimonial_quote: "We needed an enterprise-grade file vault portal that was fast and secure. Zorvate delivered beyond expectations.",
    testimonial_author: "Zainab Malik",
    testimonial_role: "COO, Apex Group",
    metrics: [
      { label: "Assets Encrypted", value: 10000, suffix: "+" },
      { label: "Platform Reliability", value: 99.9, suffix: "%" },
      { label: "Average Load Speed", value: 0.28, suffix: "s" }
    ],
    process_steps: [
      { phase: "Phase 01", title: "Security Blueprint", desc: "Designed strict profile relations and workspace partitions." },
      { phase: "Phase 02", title: "Vault Architecture", desc: "Created secure storage bucket parameters." },
      { phase: "Phase 03", title: "Collaborative Coding", desc: "Built files uploading nodes and real-time message boards." },
      { phase: "Phase 04", title: "Compliance Review", desc: "Verified file vault integrity under concurrent loads." }
    ],
    client_name: "Apex Management Group",
    project_date: "2025-11-10"
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "PKR 350k - 500k / month",
    display_order: 0,
    status: "open"
  },
  {
    id: "job-2",
    title: "UI/UX Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "PKR 250k - 350k / month",
    display_order: 1,
    status: "open"
  },
  {
    id: "job-3",
    title: "Project Operations Manager",
    department: "Management",
    location: "Remote",
    type: "Part-time",
    salary: "PKR 150k - 200k / month",
    display_order: 2,
    status: "open"
  }
];

export const MOCK_SITE_SETTINGS: Record<string, string> = {
  projects_completed: "—",
  happy_clients: "—",
  solutions_delivered: "—",
  years_building: "—",
  satisfaction: "—",
  projects_delivered: "—",
  response_time: "—",
  custom_software: "—",
  countries_served: "—",
  company_name: "Zorvate",
  company_email: "hello@zorvate.com",
  company_phone: "+92 (300) 123-4567",
  company_address: "Remote Worldwide",
  company_description: "We engineer high-fidelity web systems, design systems, and digital dashboards for teams requiring elite engineering quality and performance optimization.",
  social_facebook: "https://facebook.com/zorvate",
  social_twitter: "https://twitter.com/zorvate",
  social_github: "https://github.com/zorvate",
  social_linkedin: "https://linkedin.com/company/zorvate",
  hero_title: "High-Fidelity Software Engineering Studio",
  hero_subtitle: "We design and build bespoke software platforms, analytics workspaces, and high-performance user interfaces for startups and enterprise teams.",
  hero_cta_text: "Initiate Consultation",
  seo_title: "Zorvate — High-Fidelity Software Engineering Studio",
  seo_description: "We design and build bespoke software platforms, analytics workspaces, and high-performance user interfaces for startups and enterprise teams.",
  seo_keywords: "software development, next.js, react, supabase, postgresql, tailwind css, design systems, digital agency, startup-friendly",
  navigation_links: '[{"title": "About Studio", "href": "/about"}, {"title": "Services", "href": "/services"}, {"title": "Portfolio", "href": "/portfolio"}, {"title": "Pricing Desk", "href": "/pricing"}, {"title": "Careers", "href": "/careers"}, {"title": "Contact Desk", "href": "/contact"}]',
  footer_links: '[{"title": "About Studio", "href": "/about"}, {"title": "Digital Services", "href": "/services"}, {"title": "Portfolio Archive", "href": "/portfolio"}, {"title": "Contact Desk", "href": "/contact"}]'
};


// ==========================================
// CMS RETRIEVAL FUNCTIONS (Graceful DB Fallbacks)
// ==========================================

export async function getFaqs(supabase: SupabaseClient): Promise<Faq[]> {
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("faqs table missing or query failed. Using static fallbacks.");
    return MOCK_FAQS;
  }
}

export async function getTestimonials(supabase: SupabaseClient): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("testimonials table missing or query failed. Using static fallbacks.");
    return MOCK_TESTIMONIALS;
  }
}

export async function getTeamMembers(supabase: SupabaseClient): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("team_members table missing or query failed. Using static fallbacks.");
    return MOCK_TEAM;
  }
}

export async function getServices(supabase: SupabaseClient): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("services table missing or query failed. Using static fallbacks.");
    return MOCK_SERVICES;
  }
}

export async function getPortfolioProjects(supabase: SupabaseClient): Promise<PortfolioProject[]> {
  try {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("portfolio_projects table missing or query failed. Using static fallbacks.");
    return MOCK_PORTFOLIO;
  }
}

export async function getJobs(supabase: SupabaseClient): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "open")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("jobs table missing or query failed. Using static fallbacks.");
    return MOCK_JOBS;
  }
}

export async function getAllJobsAdmin(supabase: SupabaseClient): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("jobs table missing or query failed. Using static fallbacks in Admin.");
    return MOCK_JOBS;
  }
}

export async function getSiteSettings(supabase: SupabaseClient): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");
    if (error) throw error;
    
    if (data && data.length > 0) {
      const settingsDict: Record<string, string> = { ...MOCK_SITE_SETTINGS };
      data.forEach((row: SiteSetting) => {
        settingsDict[row.key] = row.value;
      });
      return settingsDict;
    }
    return MOCK_SITE_SETTINGS;
  } catch {
    console.warn("site_settings table missing or query failed. Using static fallbacks.");
    return MOCK_SITE_SETTINGS;
  }
}

export async function getRawSiteSettings(supabase: SupabaseClient): Promise<SiteSetting[]> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");
    if (error) throw error;
    if (data && data.length > 0) {
      return data;
    }
  } catch {
    console.warn("site_settings table missing.");
  }
  return Object.keys(MOCK_SITE_SETTINGS).map(key => ({
    key,
    value: MOCK_SITE_SETTINGS[key],
    label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  }));
}

// ==========================================
// CMS PERSISTENCE FUNCTIONS
// ==========================================

export async function saveFaq(supabase: SupabaseClient, faq: Partial<Faq>): Promise<Faq> {
  const { data, error } = await supabase
    .from("faqs")
    .upsert(faq)
    .select()
    .single();
  if (error) throw error;
  return data as Faq;
}

export async function deleteFaq(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function saveTestimonial(supabase: SupabaseClient, testimonial: Partial<Testimonial>): Promise<Testimonial> {
  const { data, error } = await supabase
    .from("testimonials")
    .upsert(testimonial)
    .select()
    .single();
  if (error) throw error;
  return data as Testimonial;
}

export async function deleteTestimonial(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function saveTeamMember(supabase: SupabaseClient, member: Partial<TeamMember>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .upsert(member)
    .select()
    .single();
  if (error) throw error;
  return data as TeamMember;
}

export async function deleteTeamMember(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function saveService(supabase: SupabaseClient, service: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .upsert(service)
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function deleteService(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function savePortfolioProject(supabase: SupabaseClient, project: Partial<PortfolioProject>): Promise<PortfolioProject> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .upsert(project)
    .select()
    .single();
  if (error) throw error;
  return data as PortfolioProject;
}

export async function deletePortfolioProject(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function saveSiteSetting(supabase: SupabaseClient, key: string, value: string, label: string): Promise<SiteSetting> {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value, label })
    .select()
    .single();
  if (error) throw error;
  return data as SiteSetting;
}

export async function saveJob(supabase: SupabaseClient, job: Partial<Job>): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .upsert(job)
    .select()
    .single();
  if (error) throw error;
  return data as Job;
}

export async function deleteJob(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
