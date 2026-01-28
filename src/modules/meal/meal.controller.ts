import asyncHandler from "../../utils/asyncHandler";
import { mealServices } from "./meal.service";

const getAllMeals = asyncHandler(async (req, res) => {
    const meals = await mealServices.getAllMeals();
    res.status(200).json(meals);
});

export const mealController = {
    getAllMeals,
};