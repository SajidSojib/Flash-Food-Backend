import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { providerService } from "./provider.service";

const createProvider = asyncHandler(async (req, res) => {
    const data = await providerService.createProvider(req.body.userId, req?.body);
    const response = new ApiResponse(201, data, "Provider created successfully");

    return response.send(res);
});

const getAllProviders = asyncHandler(async (req, res) => {
    const data = await providerService.getAllProviders();
    const response = new ApiResponse(200, data, "Providers fetched successfully");

    return response.send(res);
});

export const providerController = {
    createProvider,
    getAllProviders,
};