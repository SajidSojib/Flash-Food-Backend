import { Role } from "../../../generated/prisma/enums";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { providerService } from "./provider.service";

const createProvider = asyncHandler(async (req, res) => {
    const data = await providerService.createProvider(req.user?.id as string, req?.body);
    const response = new ApiResponse(201, data, "Provider created successfully");

    return response.send(res);
});

const getAllProviders = asyncHandler(async (req, res) => {
    const data = await providerService.getAllProviders();
    const response = new ApiResponse(200, data, "Providers fetched successfully");

    return response.send(res);
});

const updateProvider = asyncHandler(async (req, res) => {
    const {providerId} = req.params;
    const isAdmin = req.user?.role === Role.ADMIN

    const data = await providerService.updateProvider(req.user?.id as string, providerId as string, req?.body, isAdmin);

    const response = new ApiResponse(200, data, "Provider updated successfully");
    return response.send(res);
})

export const providerController = {
    createProvider,
    getAllProviders,
    updateProvider
};