import { Metadata } from "next";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: "Read our terms of service and client collaboration rules.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-muted-foreground mt-2">Last updated: July 1, 2026</p>

          <div className="mt-8 prose prose-zinc dark:prose-invert space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              Welcome to <strong>{siteConfig.name}</strong>. By using our marketing website, registering for the Client Portal, or engaging our software services, you agree to comply with and be bound by the following terms.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">1. Engagement of Services</h2>
            <p>
              Zorvate delivers design, full-stack development, and SaaS management solutions. Specific deliverables, deadlines, and project budgets are governed by individual contracts and visualized inside our Client Portal project timelines.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">2. Account Registration</h2>
            <p>
              You must register for an account in the Client Portal to track project progression, exchange messages, and manage invoices. You are solely responsible for safeguarding your login credentials.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">3. Payment Terms</h2>
            <p>
              All pricing and billing information is logged under the billing panel in the client portal. Unpaid invoices past the due date may result in a temporary suspension of project development services.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
