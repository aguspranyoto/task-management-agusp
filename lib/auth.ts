import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import EmailTemplate from "@/components/email-template";
import * as React from "react";
import { render } from "@react-email/render";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("Verification URL:", url); // Log the verification URL for debugging
      if (process.env.RESEND_API_KEY) {
        console.log("Sending verification email to:", user.email);
        try {
          const htmlContent = await render(
            React.createElement(EmailTemplate, {
              userName: user.name,
              verificationUrl: url,
            }),
          );

          console.log(
            "Using raw fetch for Resend to bypass DNS constraints...",
          );
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from:
                process.env.RESEND_FROM_EMAIL ||
                "Support Task App Agusp <support@agusp.com>",
              to: user.email,
              subject: "Verify your email for Task App",
              html: htmlContent,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            console.log("Resend Email Sent ID via Fetch:", data.id);
          } else {
            console.error("Resend API Error via Fetch:", data);
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
      } else {
        console.warn(
          "Skipped sending email because RESEND_API_KEY is not set in .env",
        );
      }
    },
  },
});
