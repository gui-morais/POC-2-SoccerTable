import { Request, Response, NextFunction } from "express";
import { teamSchema } from "../models/teamSchema.js";

export function teamValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = teamSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(422).send(error.message);
    }

    next();
}