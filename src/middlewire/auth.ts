import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      if(!session) {
          
      }
    } catch (error) {
      next(error);
    }
  };
};
