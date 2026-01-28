import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { mealService } from "./meal.service";

const createMeal = asyncHandler(async (req, res) => {
    const data = await mealService.createMeal(req.user?.id as string, req?.body);
    
    const response = new ApiResponse(201, data, "Meal created successfully");
    return response.send(res);
});

const getAllMeals = asyncHandler(async (req, res) => {
    const meals = await mealService.getAllMeals();

    const response = new ApiResponse(200, meals, "Meals fetched successfully");
    return response.send(res);
});


export const mealController = {
    createMeal,
    getAllMeals,
};