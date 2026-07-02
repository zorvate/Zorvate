import { Metadata } from "next";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: "Read our privacy policy to understand how we process and safeguard your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mt-2">Last updated: July 1, 2026</p>

          <div className="mt-8 prose prose-zinc dark:prose-invert space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              At <strong>{siteConfig.name}</strong>, we are committed to protecting your privacy. This Privacy Policy details how we collect, use, and store the information you share on our digital platform.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when signing up for our client portal, submitting contact queries, or applying for job postings. This includes your name, email address, company details, project description, and files like resumes or design assets.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">2. How We Use Your Data</h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manage your client portal account and secure access.</li>
              <li>Collaborate on milestones, files, and project tasks.</li>
              <li>Process invoicing and billing payments.</li>
              <li>Respond to direct service inquiries and careers board listings.</li>
            </ul>

            <h2 className="text-lg font-bold text-foreground mt-6">3. Security</h2>
            <p>
              Your data is stored securely in our database systems, protected by Supabase Row-Level Security (RLS) constraints. We restrict server database access solely to authorized personnel.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
