import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { categoryService } from "./category.service";

const createCategory = asyncHandler(async (req, res) => {
    const data = await categoryService.createCategory(req.body);
    const response = new ApiResponse(201, data, "Category created successfully");

    return response.send(res);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await categoryService.deleteCategory(id as string);

    const response = new ApiResponse(200, data, "Category deleted successfully");
    return response.send(res);
});

export const categoryController = {
    createCategory,
    deleteCategory
}