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

const getMealById = asyncHandler(async (req, res) => {
    const data = await mealService.getMealById(req.params.id as string);
    
    const response = new ApiResponse(200, data, "Meal fetched successfully");
    return response.send(res);
})

const updateMeal = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const data = await mealService.updateMeal(id as string, req.user?.id as string, req?.body);
    
    const response = new ApiResponse(200, data, "Meal updated successfully");
    return response.send(res);
})


export const mealController = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal
};