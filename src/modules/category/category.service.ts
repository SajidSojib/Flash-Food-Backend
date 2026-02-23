import type { Category } from "../../../generated/prisma/client";
import type { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import type { CategoryOrderByWithRelationInput, CategoryWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

const createCategory = async (data: Category) => {
  data.slug = data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const existingCategory = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
  });
  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  } 

  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async (
  page: string | number,
  limit: string | number,
  search: string | undefined,
  createdOrder: SortOrder = "desc",
  mealOrder?: SortOrder,
) => {
  page = Number(page) || 1;
  const andCondition: CategoryWhereInput[] = [];
  if(search) {
    andCondition.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    });
  }

  const orderCondition: CategoryOrderByWithRelationInput[] = [];
  if(mealOrder) {
    orderCondition.push({
      meals: {
        _count: mealOrder,
      },
    });
  }
  if(createdOrder) {
    orderCondition.push({
      createdAt: createdOrder,
    });
  }

  const totalCount = await prisma.category.count({
    where: {
      AND: andCondition,
    },
  });

  if(limit === "all") {
    limit = totalCount;
  }else {
    limit = Number(limit) || 10;
  }
  
  const categories = await prisma.category.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
    orderBy: orderCondition,
    skip: (page - 1) * limit,
    take: limit,
  });

  

  return {
    data: categories,
    meta: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const updateCategory = async (id: string, name: string, description: string) => {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return await prisma.category.update({
    where: {
      id
    },
    data: {
      name,
      slug,
      description
    },
  })
}

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
