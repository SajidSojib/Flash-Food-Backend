import { email } from "better-auth";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  db_url: process.env.DATABASE_URL,
  port: process.env.PORT || 8000,
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  backend_url: process.env.BACKEND_URL || "http://localhost:8000",
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  resend_api: process.env.RESEND_API,
  email_from: process.env.EMAIL_FROM as string,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_role: process.env.ADMIN_ROLE,
  admin_phone: process.env.ADMIN_PHONE,
  admin_image: process.env.ADMIN_IMAGE,
};

export default config;
