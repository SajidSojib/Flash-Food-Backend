import { toNodeHandler } from "better-auth/node";
import { Router, type Request, type Response } from "express";
import { auth } from "../../lib/auth";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    req.url = "/sign-in/email";
    return toNodeHandler(auth)(req, res);
})

router.post("/register", async (req: Request, res: Response) => {
    req.url = "/sign-up/email";
    toNodeHandler(auth)(req, res);
})

router.post("/logout", async (req: Request, res: Response) => {
    req.url = "/sign-out/email";
    return toNodeHandler(auth)(req, res);
})

export const authRouter: Router = router;