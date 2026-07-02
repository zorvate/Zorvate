export async function sendConfirmationEmail(to: string, name: string) {
  console.log(`
=============================================================
[MOCK EMAIL SERVICE] CONFIRMATION EMAIL DISPATCHED
To: ${to}
Subject: Inquiry Received - Zorvate V2 Studio
Body:
  Hi ${name},

  Thank you for initiating a consultation request with Zorvate.
  We have safely logged your project details in our client CRM. 
  Our studio representatives will reach out to you within 24 hours.

  Regards,
  The Zorvate Client Services Team
=============================================================
  `);
  return { success: true, messageId: `confirm_mock_${Date.now()}` };
}

export async function sendAdminInquiryNotification(
  adminEmail: string,
  inquiry: { name: string; email: string; company?: string; message: string; budget?: string; project_type?: string }
) {
  console.log(`
=============================================================
[MOCK EMAIL SERVICE] ADMIN INCOMING LEAD NOTIFICATION
To Admin: ${adminEmail}
Subject: [NEW LEAD] CRM Submission - ${inquiry.name} (${inquiry.company || "No Company"})
Body:
  A new project inquiry has been submitted!

  Lead Metadata:
  - Name: ${inquiry.name}
  - Email: ${inquiry.email}
  - Company: ${inquiry.company || "N/A"}
  - Project Type: ${inquiry.project_type || "N/A"}
  - Budget Tier: ${inquiry.budget || "N/A"}

  Lead Message:
  "${inquiry.message}"

  Action Required:
  Review and qualify this lead in the Admin dashboard:
  https://zorvate.com/admin/contact
=============================================================
  `);
  return { success: true, messageId: `admin_mock_${Date.now()}` };
}
