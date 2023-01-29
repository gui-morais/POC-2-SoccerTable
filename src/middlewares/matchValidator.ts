import { NextFunction, Request, Response } from "express";
import { matchSchema } from "../models/matchSchema.js";

export function matchValidator(req:Request, res:Response, next: NextFunction) {
    const { error } = matchSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(422).send(error.message);
    }

    next();    
}