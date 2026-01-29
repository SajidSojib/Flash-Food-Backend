import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { orderService } from "./order.service";

const createOrder = asyncHandler(async (req, res) => {
    const {mealIdArray, ...rest} = req.body
    const data = await orderService.createOrder(req.user?.id as string, rest, mealIdArray);

    const response = new ApiResponse(201, data, "Order created successfully");
    return response.send(res);
})


export const orderController = {
    createOrder
}