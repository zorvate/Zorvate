export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "saas-development",
    title: "SaaS Development",
    shortDescription: "Scalable SaaS platforms built with modern technologies.",
    description:
      "We build secure, scalable SaaS applications using Next.js, TypeScript, Supabase, and PostgreSQL.",
    features: [
      "Authentication",
      "Admin Dashboard",
      "Billing Ready",
      "Responsive UI",
      "Production Architecture",
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortDescription: "Modern interfaces focused on usability and conversion.",
    description:
      "From wireframes to polished interfaces, we design products that are intuitive and visually appealing.",
    features: [
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Accessibility",
      "Responsive Design",
    ],
  },
  {
    slug: "full-stack-web-apps",
    title: "Full-Stack Web Apps",
    shortDescription: "Complete web applications from frontend to backend.",
    description:
      "Custom applications with modern frontend, backend, authentication, storage, and APIs.",
    features: [
      "Next.js",
      "Supabase",
      "API Integration",
      "Database Design",
      "Deployment",
    ],
  },
];