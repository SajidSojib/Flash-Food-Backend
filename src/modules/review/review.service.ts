import { prisma } from "../../lib/prisma"
import { ApiError } from "../../utils/apiError"

const createReview = async (currentId: string, userId: string, mealId: string, orderId: string, rating: number, comment: string) => {
    if(currentId !== userId){
        throw new ApiError(403, "You are not authorized to create this review")
    }
    return await prisma.review.create({
        data: {
            userId,
            mealId,
            orderId,
            rating,
            comment
        }
    })
}

const getAllReviews = async (mealId: string) => {
    return await prisma.review.findMany({
        where: {
            mealId
        }
    })
}

const updateReview = async (currentId: string, userId: string, reviewId: string, rating: number, comment: string) => {
    if(currentId !== userId){
        throw new ApiError(403, "You are not authorized to update this review")
    }
    return await prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            rating,
            comment
        }
    })
}

const deleteReview = async (currentId: string, userId: string, reviewId: string) => {
    if(currentId !== userId){
        throw new ApiError(403, "You are not authorized to delete this review")
    }
    return await prisma.review.delete({
        where: {
            id: reviewId
        }
    })
}

export const ReviewService = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview
}