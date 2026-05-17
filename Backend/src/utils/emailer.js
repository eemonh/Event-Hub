import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendContactNotification(contact) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.EMAIL_HOST) {
    console.log("Email not configured; skipping notification.");
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@eventhub.com",
      to: adminEmail,
      subject: `New Contact: ${contact.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    });
    console.log("Contact notification email sent.");
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
  }
}
