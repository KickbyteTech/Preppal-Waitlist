// supabase/functions/welcome-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'npm:resend';

// Initialize Resend with your API key from a secure environment variable
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

// The email address you want to send from (must be a verified domain in Resend)
const FROM_EMAIL = 'welcome@yourdomain.com'; // <-- REPLACE with your verified sender email
const FROM_NAME = 'PrepPal';

serve(async (req) => {
  try {
    const { record } = await req.json();
    const userEmail = record.email;

    if (!userEmail) {
      throw new Error("Email is missing in the webhook payload");
    }

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [userEmail],
      subject: 'Welcome to the PrepPal Waitlist! 🎉',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
              .header { font-size: 24px; font-weight: bold; color: #22d3ee; }
              .footer { margin-top: 20px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <p class="header">You're on the list!</p>
              <p>Hi there,</p>
              <p>Thank you for signing up for the PrepPal waitlist. We're thrilled to have you on board!</p>
              <p>We're working hard to build the ultimate AI study partner, and you'll be among the first to get access when we launch.</p>
              <p>Stay tuned for updates!</p>
              <p>Best,<br>The PrepPal Team</p>
              <div class="footer">
                <p>You received this email because you signed up on the PrepPal website.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error({ error });
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});