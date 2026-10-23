import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { colors } from "@/lib/colors";

const resend = new Resend(process.env.RESEND_API_KEY);

// Form values are interpolated into the notification email's HTML.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, company, services, budget, details, website } = body as {
    name: string;
    email: string;
    company?: string;
    services?: string[];
    budget?: string;
    details: string;
    website?: string;
  };

  // Honeypot — the "website" field is hidden from people, so anything
  // in it came from a bot. Pretend it worked so the bot moves on.
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // ── Validation ───────────────────────────────────────────
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }
  if (!details || typeof details !== "string" || details.trim().length === 0) {
    return NextResponse.json(
      { error: "Project details are required." },
      { status: 400 },
    );
  }

  // ── Email HTML ────────────────────────────────────────────
  const servicesRow =
    services && services.length > 0
      ? `<tr>
           <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};width:150px;color:${colors.textSecondary};font-size:13px;vertical-align:top;">Services Needed</td>
           <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};font-size:14px;">${services.map((x) => escapeHtml(String(x))).join(", ")}</td>
         </tr>`
      : "";

  const companyRow = company?.trim()
    ? `<tr>
         <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};width:150px;color:${colors.textSecondary};font-size:13px;vertical-align:top;">Company / Website</td>
         <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};font-size:14px;">${escapeHtml(company.trim())}</td>
       </tr>`
    : "";

  const budgetRow = budget?.trim()
    ? `<tr>
         <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};width:150px;color:${colors.textSecondary};font-size:13px;vertical-align:top;">Budget Range</td>
         <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};font-size:14px;">${escapeHtml(budget.trim())}</td>
       </tr>`
    : "";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:${colors.textBody};">
      <div style="background:${colors.bgDark};padding:32px 40px;margin-bottom:0;">
        <p style="color:${colors.accent};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;font-weight:600;">
          New Project Inquiry
        </p>
        <h1 style="color:${colors.bgLight};font-size:26px;font-weight:800;margin:0;letter-spacing:-0.02em;">
          ${escapeHtml(name.trim())}
        </h1>
        <p style="color:${colors.textSecondary};font-size:14px;margin:6px 0 0;">${escapeHtml(email.trim())}</p>
      </div>

      <div style="background:${colors.bgLight};padding:32px 40px;border:1px solid ${colors.borderLight};border-top:none;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};width:150px;color:${colors.textSecondary};font-size:13px;vertical-align:top;">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid ${colors.borderLight};font-size:14px;">${escapeHtml(email.trim())}</td>
          </tr>
          ${companyRow}
          ${servicesRow}
          ${budgetRow}
        </table>

        <div style="margin-top:24px;">
          <p style="color:${colors.textSecondary};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin:0 0 10px;">
            Project Details
          </p>
          <p style="font-size:14px;line-height:1.8;margin:0;color:${colors.textBody};white-space:pre-wrap;">${escapeHtml(details.trim())}</p>
        </div>
      </div>

      <div style="padding:20px 40px;background:${colors.emailFooterBg};border:1px solid ${colors.borderLight};border-top:none;">
        <p style="font-size:12px;color:${colors.textSecondary};margin:0;">
          Submitted via leonisstudios.com — reply directly to this email to respond.
        </p>
      </div>
    </div>
  `;

  // ── Send ──────────────────────────────────────────────────
  // Resend reports API failures in the returned { error } rather than
  // throwing, so check it — otherwise a failed send looks like a sent lead.
  try {
    const { error } = await resend.emails.send({
      from: "Leonis Studios <noreply@leonisstudios.com>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email.trim(),
      subject: `New Lead: ${name.trim()}${company?.trim() ? ` (${company.trim()})` : ""}`,
      html,
    });
    if (error) {
      console.error("Contact form email failed:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again." },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to send your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
