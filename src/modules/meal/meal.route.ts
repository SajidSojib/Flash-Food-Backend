import { Router } from "express";
import { mealController } from "./meal.controller";
import auth from "../../middlewire/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.PROVIDER),  mealController.createMeal);
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.patch("/:id", auth(Role.PROVIDER), mealController.updateMeal);

export const mealRouter: Router = router;