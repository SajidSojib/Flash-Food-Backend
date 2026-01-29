import {
    OrderStatus,
  Role,
  type Order,
  type OrderStatus as OrderStatusType,
  type Role as RoleType,
} from "../../../generated/prisma/client";
import type { OrderWhereInput } from "../../../generated/prisma/models";
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
        include: {
          items: {
            select: {
              quantity: true,
              meal: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });
      const data = {
        ...order,
        items: order.items.map((item) => {
          return {
            quantity: item.quantity,
            name: item.meal.name,
            price: item.meal.price,
          };
        }),
      };
      orders.push(data);
    }
    return orders;
  });
};

const getAllOrders = async (
  currentId: string,
  currentRole: RoleType,
  status?: OrderStatusType,
  userId?: string,
  providerId?: string,
) => {
  const andConditions: OrderWhereInput[] = [];
  if (userId) {
    console.log(userId==currentId);
    if (userId !== currentId && currentRole !== Role.ADMIN) {
      throw new ApiError(403, "You are not authorized to view these orders");
    }
    andConditions.push({ userId });
  }
  if (providerId) {
    const provider = await prisma.providerProfile.findUnique({
      where: {
        id: providerId,
      },
    });
    if (provider?.userId !== currentId && currentRole !== Role.ADMIN) {
      throw new ApiError(403, "You are not authorized to view these orders");
    }
    andConditions.push({ providerId });
  }
  if (status) {
    andConditions.push({ status });
  }
  if(andConditions.length === 0 && currentRole !== Role.ADMIN){
      throw new ApiError(403, "Only admin can view all orders. You need to add query parameters to view your orders");
  }
  
  return await prisma.order.findMany({
      where: {
          AND: andConditions
      },
      orderBy: {
          createdAt: "desc"
      }
  })
};

const updateOrderStatus = async (currentRole: RoleType, orderId: string, status: OrderStatusType) => {
  //   placed(default) -> preparing -> delivered -> receaved
  //  only customer can change status to cancelled, receaved
  //  only provider can change status to preparing, delivered, rejected

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  //   placed(default) -> preparing -> delivered -> receaved
 const allowedPerStatus: Record<OrderStatus, OrderStatus[]> = {
   [OrderStatus.PLACED]: [
     OrderStatus.PREPARING,
     OrderStatus.REJECTED,
     OrderStatus.CANCELLED,
   ],
   [OrderStatus.PREPARING]: [
     OrderStatus.DELIVERED,
     OrderStatus.REJECTED,
     OrderStatus.CANCELLED,
   ],
   [OrderStatus.DELIVERED]: [OrderStatus.RECEAVED],
   [OrderStatus.RECEAVED]: [],
   [OrderStatus.CANCELLED]: [],
   [OrderStatus.REJECTED]: [],
 };

  if (!allowedPerStatus[order.status].includes(status)) {
    throw new ApiError(403, `You can not change ${order?.status} order to ${status}`);
  }

  // customer -> receaved, cancelled
  // provider -> preparing, delivered, rejected
  const allowedPerRole: Record<Role, OrderStatus[]> = {
    [Role.CUSTOMER]: [OrderStatus.CANCELLED, OrderStatus.RECEAVED],
    [Role.PROVIDER]: [
      OrderStatus.PREPARING,
      OrderStatus.DELIVERED,
      OrderStatus.REJECTED,
    ],
    [Role.ADMIN]: [],
  };

  if (!allowedPerRole[currentRole].includes(status)) {
    throw new ApiError(403, `You are not authorized to change ${order?.status} order to ${status}`);
  }
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
};

export const orderService = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
