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
};

export default config;
