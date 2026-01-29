import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../middlewire/auth";

const router = Router();

router.post("/", auth(), orderController.createOrder);
router.get("/", auth(), orderController.getAllOrders);


export const orderRouter: Router = router;