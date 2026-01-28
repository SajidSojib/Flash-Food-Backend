import type { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";


const createMeal = async (currentId: string, data: Meal & { categories: string[] } ) => {
    if(currentId !== data.userId){
        throw new ApiError(403, "You are not authorized to create this meal")
    }
    const {categories, userId, ...rest} = data
    return await prisma.meal.create({
        data: {
            ...rest,
            userId: currentId,
            categories: {
                connect: categories.map((category: string) => ({ slug: category }))
            }
        },
    });
}

const getAllMeals = async () => {
    const meals = await prisma.meal.findMany({
        include: {
            categories: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    });
    
    meals.map((meal: (Meal & { categories: { name: string }[]; _count: { reviews: number } })) => {
        meal.categories = meal.categories.map((category: any) => category.name);
        return meal;
    })
    return meals;
};

const getMealById = async (id: string) => {
    await prisma.meal.findUniqueOrThrow({
        where: {
            id
        }
    })
    const meal = await prisma.meal.findUnique({
        where: {
            id
        },
        include: {
            categories: {
                select: {
                    name: true
                }
            },
            reviews: {
                select: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            email: true
                        }
                    },
                    rating: true,
                    comment: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })
    const categoryArray  = meal?.categories.map((category: { name: string }) => category.name);
    return { ...meal, categories: categoryArray }
}


export const mealService = {
    getAllMeals,
    createMeal,
    getMealById
};