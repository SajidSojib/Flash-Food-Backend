import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { Roles } from "../types/constants/roles";
import { Resend } from "resend";
import { resend } from "./resend";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [config.frontend_url],
  advanced: {
    cookiePrefix: "Flash-Food",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: Roles.CUSTOMER,
      },
      phone: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await resend.emails.send({
        from: config.email_from,
        to: user.email,
        subject: "Verify your email address • FLASH FOOD",
        text: `
Welcome to FlashFood!

Please verify your email address by clicking the link below:
${url}

If you didn’t create this account, you can safely ignore this email.
    `,

        html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">Welcome to FlashFood 🍽️</h2>

        <p style="color:#444; font-size:14px;">
          Hi ${user.name || "there"},<br/><br/>
          Thanks for signing up. Please confirm your email address to activate your account.
        </p>

        <div style="text-align:center; margin: 28px 0;">
          <a href="${url}"
             style="
               background-color:#000;
               color:#fff;
               padding:12px 20px;
               text-decoration:none;
               border-radius:8px;
               font-weight:600;
               display:inline-block;
             ">
            Verify Email
          </a>
        </div>

        <p style="font-size:12px; color:#777;">
          Or copy and paste this link into your browser:<br/>
          ${url}
        </p>

        <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />

        <p style="font-size:12px; color:#999;">
          If you didn’t create an account, you can safely ignore this email.<br/>
          © ${new Date().getFullYear()} FlashFood. All rights reserved.
        </p>
      </div>
    `,
      });
    },
  },
});
