import { prisma } from "../../lib/prisma";

const getAllMeals = async () => {
    const meals = await prisma.meal.findMany();
    return meals;
};


export const mealService = {
    getAllMeals,
};