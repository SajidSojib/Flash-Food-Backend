import type { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

const createOrder = async (currentId: string, data: Order, mealIdArray: string[]) => {
    if(currentId !== data.userId){
        throw new ApiError(403, "You are not authorized to create this order")
    }
    const {status, createdAt, updatedAt, ...rest} = data

    return await prisma.order.create({
        data: {
            ...rest,
            userId: currentId,
            items: {
                connect: mealIdArray.map((mealId: string) => ({id: mealId}))
            }
        },
    });
}


export const orderService = {
    createOrder
}