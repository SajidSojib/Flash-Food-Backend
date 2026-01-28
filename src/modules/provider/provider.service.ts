import type { ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProvider = async (currentId: string, data: ProviderProfile) => {
    const {id, userId, isApproved, createdAt, updatedAt, ...rest} = data
  const provider = await prisma.providerProfile.create({
    data: {
      ...rest,
      userId: currentId
    }
  });
  return provider;
};

const getAllProviders = async () => {
    const providers = await prisma.providerProfile.findMany();
    return providers;
}


export const providerService = {
  createProvider,
  getAllProviders
};