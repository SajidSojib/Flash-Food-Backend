import { Role, type ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

const createProvider = async (currentId: string, data: ProviderProfile) => {
  const {id, userId, isApproved, createdAt, updatedAt, ...rest} = data
  return await prisma.$transaction( async (tx) => {
    const provider = await tx.providerProfile.create({
      data: {
        ...rest,
        userId: currentId
      }
    })
    await tx.user.update({
      where: {
        id: currentId
      },
      data: {
        role: Role.PROVIDER
      }
    })
    return provider
  })
};

const getAllProviders = async () => {
    const providers = await prisma.providerProfile.findMany({
        include: {
            meals: true
        }
    });
    return providers;
}

const updateProvider = async (userId: string, providerId: string, data: Partial<ProviderProfile>, isAdmin: boolean) => {
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: providerId
        }
    })
    if (!isAdmin && provider?.userId !== userId) {
      throw new ApiError(403, "You are not authorized to update this provider profile");
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
            id: providerId
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