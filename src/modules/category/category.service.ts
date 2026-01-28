import type { Category } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { ApiError } from "../../utils/apiError"

const createCategory = async (data: Category) => {
    data.slug = data.name.toLowerCase().replace(/ /g, "-");
    const existingCategory = await prisma.category.findUnique({
        where: {
            slug: data.slug
        }
    })
    if (existingCategory) {
        throw new ApiError(400, "Category already exists")
    }
    
    return await prisma.category.create({
        data
    })
}

const getAllCategories = async () => {
    return await prisma.category.findMany();
}

const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id
        }
    })
    if(!category){
        throw new ApiError(404, "Category not found")
    }
    if (!category) {
        throw new ApiError(404, "Category not found")
    }
    await prisma.meal.deleteMany({
        where: {
            categoryId: id
        }
    })
    return await prisma.category.delete({
        where: {
            id
        }
    })
}


export const categoryService = {
    createCategory,
    getAllCategories,
    deleteCategory,
}