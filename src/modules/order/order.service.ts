import {
  Role,
  type Order,
  type OrderStatus,
  type Role as RoleType,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

const createOrder = async (
  currentId: string,
  totalAmount: number,
  deliveryAddress: string,
  deliveryInstructions: string,
  data: {
    mealId: string;
    providerId: string;
    price: number;
    quantity: number;
  }[],
) => {
  // { providerId: [{ mealId, price, quantity }] }
  const dataTable = data.reduce(
    (table, item) => {
      const { mealId, providerId, price, quantity } = item;

      if (!table[providerId]) table[providerId] = [];
      table[providerId].push({ mealId, price, quantity });
      return table;
    },
    {} as Record<string, { mealId: string; price: number; quantity: number }[]>,
  );

  return await prisma.$transaction(async (tx) => {
    const orders: Order[] = [];
    for (const [providerId, items] of Object.entries(dataTable)) {
      const provider = await tx.providerProfile.findUnique({
        where: {
          id: providerId,
        },
      });
      if (!provider) {
        throw new ApiError(404, `Provider not found with id ${providerId}`);
      }
      const order = await tx.order.create({
        data: {
          providerId,
          userId: currentId,
          totalAmount,
          deliveryAddress,
          deliveryInstructions,
          items: {
            createMany: {
              data: items,
            },
          },
        },
      });
      orders.push(order);
    }
    return orders.map((order) => {
      return tx.order.findUnique({
        where: {
          id: order.id,
        }
      });
    });
  })
};

const getAllOrders = async (
  currentId: string,
  currentRole: RoleType,
  status?: OrderStatus,
  userId?: string,
  providerId?: string,
) => {
  const conditions = [];
  if (userId && currentRole === Role.CUSTOMER) {
    if (currentId !== userId) {
      throw new ApiError(403, "You are not authorized to get these orders");
    }
    conditions.push({ userId: userId });
  } else if (providerId && currentRole === Role.PROVIDER) {
    const provider = await prisma.providerProfile.findUnique({
      where: {
        id: providerId,
      },
    });
    if (provider?.userId !== currentId) {
      throw new ApiError(403, "You are not authorized to get these orders");
    }
    conditions.push({ providerId: providerId });
  }
  if (status) {
    conditions.push({ status: status });
  }
  return await prisma.order.findMany({
    where: {
      AND: conditions,
    },
  });
};

export const orderService = {
  createOrder,
  getAllOrders,
};
