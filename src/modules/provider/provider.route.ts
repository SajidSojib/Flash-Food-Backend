import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middlewire/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), providerController.createProvider);
router.get("/", providerController.getAllProviders)
router.patch("/:providerId", auth(Role.ADMIN, Role.PROVIDER), providerController.updateProvider)


export const providerRouter: Router = router;