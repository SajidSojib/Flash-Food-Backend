import { Role, type Order, type OrderStatus, type Role as RoleType } from "../../../generated/prisma/client";
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


const getAllOrders = async (currentId: string, currentRole: RoleType, status?: OrderStatus, userId?: string, providerId?: string) => {
    const conditions = []
    if(userId && currentRole === Role.CUSTOMER){
        if(currentId !== userId){
            throw new ApiError(403, "You are not authorized to get these orders")
        }
        conditions.push({userId: userId})
    }
    else if(providerId && currentRole === Role.PROVIDER){
        const provider = await prisma.providerProfile.findUnique({
            where: {
                id: providerId
            }
        })
        if(provider?.userId !== currentId){
            throw new ApiError(403, "You are not authorized to get these orders")
        }
        conditions.push({providerId: providerId})
    }
    if(status){
        conditions.push({status: status})
    }
    return await prisma.order.findMany({
        where: {
            AND: conditions
        }
    });
    
}


export const orderService = {
    createOrder,
    getAllOrders
}