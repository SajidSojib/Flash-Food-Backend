import asyncHandler from "../../utils/asyncHandler";
import { mealService } from "./meal.service";

const getAllMeals = asyncHandler(async (req, res) => {
    const meals = await mealService.getAllMeals();
    res.status(200).json(meals);
});

export const mealController = {
    getAllMeals,
};