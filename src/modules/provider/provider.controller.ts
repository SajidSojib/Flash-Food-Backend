import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { providerServices } from "./provider.service";

const createProvider = asyncHandler(async (req, res) => {
    const provider = await providerServices.createProvider(req?.?user?.id, req?.body);
    return new ApiResponse(201, provider, "Provider created successfully");
});


export const providerControllers = {
    createProvider,
};