import type { ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

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

const updateProvider = async (id: string, data: Partial<ProviderProfile>, isAdmin: boolean) => {
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id
        }
    })
    if (!isAdmin && provider?.userId !== id) {
      throw new ApiError(403, "You are not authorized to update this post");
    }
    if(!isAdmin){
        delete(data.isApproved)
    }
    delete(data.userId);
    delete(data.id);
    delete(data.createdAt);
    delete(data.updatedAt);
    return await prisma.providerProfile.update({
        where: {
            id
        },
        data: {
            ...data
        }
    })

}


export const providerService = {
  createProvider,
  getAllProviders,
  updateProvider
};