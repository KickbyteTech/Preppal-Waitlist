// supabase/functions/welcome-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'npm:resend';

// --- Define a type for the incoming data from the trigger ---
interface WebhookPayload {
  record: {
    email: string;
  };
}

// --- Safely get the API key ---
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
  // If the key isn't set, throw an error to stop the function
  throw new Error("RESEND_API_KEY environment variable is not set.");
}

const resend = new Resend(RESEND_API_KEY);

const FROM_EMAIL = 'preppal.live@gmail.com'; // <-- Use your verified domain
const FROM_NAME = 'PrepPal';

// --- Main function to handle requests ---
serve(async (req: Request) => { // <-- Added type `Request` to req
  try {
    // Check if the API key was loaded correctly
    if (!resend) {
      throw new Error("Resend client failed to initialize.");
    }

    // --- Specify the type of the JSON payload ---
    const payload: WebhookPayload = await req.json();
    const userEmail = payload.record?.email; // Use optional chaining for safety

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
        status: 400, // Use 400 for client-side errors from the API
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // --- Handle errors safely ---
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});