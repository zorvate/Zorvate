export async function sendConfirmationEmail(to: string, name: string) {
  return {
    success: true,
    messageId: `confirm_mock_${Date.now()}`,
    preview: {
      to,
      name,
    },
  };
}

export async function sendAdminInquiryNotification(
  adminEmail: string,
  inquiry: { name: string; email: string; company?: string; message: string; budget?: string; project_type?: string }
) {
  return {
    success: true,
    messageId: `admin_mock_${Date.now()}`,
    preview: {
      adminEmail,
      inquiry,
    },
  };
}
