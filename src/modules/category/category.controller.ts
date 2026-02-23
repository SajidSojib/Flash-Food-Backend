import type { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { categoryService } from "./category.service";

const createCategory = asyncHandler(async (req, res) => {
  const data = await categoryService.createCategory(req.body);
  const response = new ApiResponse(201, data, "Category created successfully");

  return response.send(res);
});

const getAllCategories = asyncHandler(async (req, res) => {
  const { search, page, limit, createdOrder, mealOrder } = req.query;
  const searchString =
    typeof search === "string" && search.trim() !== "" && search !== "undefined"
      ? search.trim()
      : undefined;
  const data = await categoryService.getAllCategories(
    page as string,
    Number(limit),
    searchString,
    createdOrder as SortOrder,
    mealOrder as SortOrder
  );
  const response = new ApiResponse(
    200,
    data,
    "Categories fetched successfully",
  );
  console.log(response);
  return response.send(res);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const data = await categoryService.updateCategory(id as string, name, description);
  const response = new ApiResponse(200, data, "Category updated successfully");
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
  getAllCategories,
  updateCategory,
  deleteCategory,
};
