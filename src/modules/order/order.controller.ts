import type { OrderStatus, Role } from "../../../generated/prisma/enums";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { orderService } from "./order.service";

const createOrder = asyncHandler(async (req, res) => {
    const {totalAmount, deliveryAddress, deliveryInstructions, orderItems} = req.body
    const data = await orderService.createOrder(req.user?.id as string, totalAmount, deliveryAddress, deliveryInstructions, orderItems);

    const response = new ApiResponse(201, data, "Order created successfully");
    return response.send(res);
})

const getAllOrders = asyncHandler(async (req, res) => {
    const {status, userId, providerId} = req.query
    const data = await orderService.getAllOrders(
        req.user?.id as string,
        req.user?.role as Role,
        status as OrderStatus,
        userId as string,
        providerId as string
    );
    
    const response = new ApiResponse(200, data, "Orders fetched successfully");
    return response.send(res);
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {status} = req.body
    const data = await orderService.updateOrderStatus(req.user?.role as Role, id as string, status);
    
    const response = new ApiResponse(200, data, "Order status updated successfully");
    return response.send(res);
})


export const orderController = {
    createOrder,
    getAllOrders,
    updateOrderStatus
}