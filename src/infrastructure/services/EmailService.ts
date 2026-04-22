import nodemailer from "nodemailer";
import { Logger } from "../../shared/logger";

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    Logger.warn(`⚠️  SMTP connection failed: ${error.message}. Emails will not be sent.`);
  } else {
    Logger.info("✅ SMTP server ready to send emails");
  }
});

export interface TicketEmailData {
  leaderName: string;
  leaderEmail: string;
  teamName: string;
  eventName: string;
  leaderPhone: string;
  leaderCollege: string;
  teamMembers: { name: string; email: string }[];
  registrationId: string;
}

function generateTicketHTML(data: TicketEmailData): string {
  const membersHtml = data.teamMembers && data.teamMembers.length > 0
    ? data.teamMembers
        .map(
          (m, i) => `
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">Member ${i + 1}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 14px;">${m.name} &lt;${m.email}&gt;</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="2" style="padding: 8px 12px; color: #aaa; font-size: 13px; font-style: italic;">Solo registration</td></tr>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Registration Confirmation</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius: 16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px 40px 32px; text-align:center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
              <h1 style="margin:0; color:#ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                You're Registered!
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">
                TechFest 2025 — Official Confirmation
              </p>
            </td>
          </tr>

          <!-- Ticket Badge -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="background: linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 100%); border: 2px dashed #a855f7; border-radius: 12px; padding: 20px 24px; margin: 28px 0 0; text-align: center;">
                <p style="margin:0; color:#6366f1; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">Ticket ID</p>
                <p style="margin: 6px 0 0; font-family: monospace; font-size: 18px; font-weight: 800; color: #1e1b4b; letter-spacing: 0.1em;">
                  #${data.registrationId.toUpperCase().slice(-10)}
                </p>
              </div>
            </td>
          </tr>

          <!-- Event Info -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <p style="margin:0 0 12px; font-size: 11px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 0.1em;">Event Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                <tr style="background: #fafafa;">
                  <td style="padding: 10px 12px; color: #888; font-size: 13px; width: 40%;">Event</td>
                  <td style="padding: 10px 12px; color: #111; font-size: 14px; font-weight: 700;">${data.eventName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #888; font-size: 13px; border-top: 1px solid #f0f0f0;">Team Name</td>
                  <td style="padding: 10px 12px; color: #111; font-size: 14px; font-weight: 600; border-top: 1px solid #f0f0f0;">${data.teamName}</td>
                </tr>
                <tr style="background: #fafafa;">
                  <td style="padding: 10px 12px; color: #888; font-size: 13px; border-top: 1px solid #f0f0f0;">Team Leader</td>
                  <td style="padding: 10px 12px; color: #111; font-size: 14px; border-top: 1px solid #f0f0f0;">${data.leaderName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #888; font-size: 13px; border-top: 1px solid #f0f0f0;">College</td>
                  <td style="padding: 10px 12px; color: #111; font-size: 14px; border-top: 1px solid #f0f0f0;">${data.leaderCollege}</td>
                </tr>
                <tr style="background: #fafafa;">
                  <td style="padding: 10px 12px; color: #888; font-size: 13px; border-top: 1px solid #f0f0f0;">Phone</td>
                  <td style="padding: 10px 12px; color: #111; font-size: 14px; border-top: 1px solid #f0f0f0;">${data.leaderPhone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Team Members -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <p style="margin:0 0 12px; font-size: 11px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 0.1em;">Team Members</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                ${membersHtml}
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                <p style="margin:0; font-size: 13px; font-weight: 700; color: #92400e;">📌 What's Next?</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #78350f; line-height: 1.6;">
                  Present this email (or your Ticket ID) at the event venue on the day of the event. 
                  For queries, reach us at <a href="mailto:techfest@college.edu" style="color: #6366f1;">techfest@college.edu</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0; margin-top: 24px;">
              <p style="margin:0; font-size: 12px; color: #bbb;">
                © 2025 TechFest. All rights reserved.<br/>
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendTicketEmail(data: TicketEmailData): Promise<void> {
  const fromName = process.env.SMTP_FROM_NAME || "TechFest 2025";
  const fromUser = process.env.SMTP_USER || "";

  const mailOptions = {
    from: `"${fromName}" <${fromUser}>`,
    to: data.leaderEmail,
    subject: `🎉 Registration Confirmed — ${data.eventName} | TechFest 2025`,
    html: generateTicketHTML(data),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    Logger.info(`✅ Ticket email sent to ${data.leaderEmail} | MessageId: ${info.messageId}`);
  } catch (error: any) {
    Logger.error(`❌ Failed to send ticket email: ${error.message}`);
    throw error;
  }
}
