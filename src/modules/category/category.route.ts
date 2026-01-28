import { Router } from "express";
import { categoryController } from "./category.controller";
import auth from "../../middlewire/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRouter: Router = router;