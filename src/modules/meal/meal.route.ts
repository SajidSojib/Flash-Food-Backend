import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Welcome to Flash Food");
});

export const mealRouter: Router = router;