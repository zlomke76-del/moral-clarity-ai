// app/api/hooks/support-created/route.ts (only the send() calls change)
const send = (to: string, subject: string, html: string, replyTo?: string) =>
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,         // e.g., "Support <support@moralclarity.ai>"
      to,
      subject,
      html,
      reply_to: replyTo || "support@moralclarity.ai",
    }),
  });

// admin email
const adminSubject = `Ticket ${row.id.slice(0,8)} • ${row.category} • ${row.title}`;
tasks.push(send(SUPPORT_TEAM_EMAIL, adminSubject, adminHtml, row.email || undefined));

// user ack
if (row.email) {
  tasks.push(send(
    row.email,
    `We received your request • ${row.title} [${row.id.slice(0,8)}]`,
    userHtml,
    "support@moralclarity.ai"
  ));
}
