import type { ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProvider = async (userId: string, data: Omit<ProviderProfile, "id" | "userId" | "createdAt" | "updatedAt" | "isApproved">) => {
  const provider = await prisma.providerProfile.create({
    data: {
      userId,
      ...data,
    }
  });
  return provider;
};
