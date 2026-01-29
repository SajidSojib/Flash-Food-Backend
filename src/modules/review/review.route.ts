import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewire/auth";

const router = Router();

router.post("/", auth(), reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.patch("/:id", auth(), reviewController.updateReview);
router.delete("/:id", auth(), reviewController.deleteReview);

export const reviewRouter: Router = router;