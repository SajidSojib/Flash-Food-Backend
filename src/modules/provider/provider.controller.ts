import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { providerService } from "./provider.service";

const createProvider = asyncHandler(async (req, res) => {
    const { token, userId } = req.body;

    try {
      const data = await providerService.createProvider(req.body);

      const response = new ApiResponse(
        201,
        data,
        "Provider created successfully",
      );

      return response.send(res);
    } catch (error) {
      if (userId) {
        try {
          await auth.api.deleteUser({
            body: { token },
          });
        } catch (deleteErr) {
          console.error("Rollback failed:", deleteErr);
        }
      }

      throw error;
    }
});

const getAllProviders = asyncHandler(async (req, res) => {
    const data = await providerService.getAllProviders();
    const response = new ApiResponse(200, data, "Providers fetched successfully");

    return response.send(res);
});

const getMyProviderProfile = asyncHandler(async (req, res) => {
    console.log(req?.user?.id);
    const data = await providerService.getMyProviderProfile(req.user?.id as string);
    const response = new ApiResponse(200, data, "Provider fetched successfully");

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
    getMyProviderProfile,
    updateProvider
};