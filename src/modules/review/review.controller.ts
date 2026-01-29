import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { ReviewService } from "./review.service";

const createReview = asyncHandler(async (req, res) => {
    const { userId, mealId, orderId, rating, comment } = req.body;
    const data = await ReviewService.createReview(req.user?.id as string, userId, mealId, orderId, rating, comment);

    const response = new ApiResponse(201, data, "Review created successfully");
    return response.send(res);
})

const getAllReviews = asyncHandler(async (req, res) => {
    const {mealId} = req.body
    const data = await ReviewService.getAllReviews(mealId);

    const response = new ApiResponse(200, data, "Reviews fetched successfully");
    return response.send(res);
})

const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;
    const data = await ReviewService.updateReview(req.user?.id as string, userId, id as string, rating, comment);

    const response = new ApiResponse(200, data, "Review updated successfully");
    return response.send(res);
})

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const data = await ReviewService.deleteReview(req.user?.id as string, userId, id as string);

    const response = new ApiResponse(200, data, "Review deleted successfully");
    return response.send(res);
})


export const reviewController = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview
}