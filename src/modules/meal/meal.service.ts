import type { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";


const createMeal = async (currentId: string, data: Meal & { categories: string[] } ) => {
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: data.providerId
        }
    })
    if(!provider){
        throw new ApiError(404, `Provider not found with id ${data.providerId}`)
    }
    if(currentId !== provider?.userId){
        throw new ApiError(403, "You are not authorized to create this meal")
    }
    const {categories, ...rest} = data
    return await prisma.meal.create({
        data: {
            ...rest,
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

const updateMeal = async (mealId: string, currentId: string, data: Meal & { categories: string[] }) => {
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: data.providerId
        }
    })
    if(!provider){
        throw new ApiError(404, `Provider not found with id ${data.providerId}`)
    }
    if(currentId !== provider?.userId){
        throw new ApiError(403, "You are not authorized to update this meal")
    }
    const meal = await prisma.meal.findUnique({
        where: {
            id: mealId
        }
    })
    if(!meal){
        throw new ApiError(404, "Meal not found")
    }
    const {id, providerId, categories, createdAt, updatedAt, ...rest} = data

    return await prisma.meal.update({
        where: {
            id: mealId
        },
        data: {
            ...rest,
            categories: {
                connect: categories.map((category: string) => ({ slug: category }))
            }
        },
    })
}

const deleteMeal = async (id: string, currentId: string, isAdmin: boolean) => {
    const meal = await prisma.meal.findUnique({
        where: {
            id
        }
    })
    if(!meal){
        throw new ApiError(404, "Meal not found")
    }
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: meal.providerId
        },
        select: {
            userId: true
        }
    })
    if(provider?.userId !== currentId && !isAdmin){
        throw new ApiError(403, "You are not authorized to delete this meal")
    }

    return await prisma.meal.delete({
        where: {
            id
        }
    })
}


export const mealService = {
    getAllMeals,
    createMeal,
    getMealById,
    updateMeal,
    deleteMeal
};