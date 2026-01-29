import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../middlewire/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(), orderController.createOrder);
router.get("/", auth(), orderController.getAllOrders);
router.patch("/:id", auth(Role.CUSTOMER, Role.PROVIDER), orderController.updateOrderStatus);


export const orderRouter: Router = router;