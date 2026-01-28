import { Router } from "express";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/", providerController.createProvider);


export const providerRouter: Router = router;