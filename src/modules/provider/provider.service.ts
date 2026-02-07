import {
  Role,
  type ProviderProfile,
  type User,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

const createProvider = async (
  providerData: {
    userId: string;
    restaurantName: string;
    description: string;
    logo: string;
    website: string;
    phone: string;
    address: string;
    deliveryFee: number;
  },
) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.create({
      data: {
        ...providerData,
      },
    });
    await tx.user.update({
      where: {
        id: providerData.userId,
      },
      data: {
        role: Role.PROVIDER,
      },
    });
    return provider;
  });
};

const getAllProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      meals: true,
    },
  });
  return providers;
};

const updateProvider = async (
  userId: string,
  providerId: string,
  data: Partial<ProviderProfile>,
  isAdmin: boolean,
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: {
      id: providerId,
    },
  });
  if (!isAdmin && provider?.userId !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to update this provider profile",
    );
  }
  if (!isAdmin) {
    delete data.isApproved;
  }
  delete data.userId;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  return await prisma.providerProfile.update({
    where: {
      id: providerId,
    },
    data: {
      ...data,
    },
  });
};

export const providerService = {
  createProvider,
  getAllProviders,
  updateProvider,
};
