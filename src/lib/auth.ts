import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { Roles } from "../types/constants/roles";

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
});
