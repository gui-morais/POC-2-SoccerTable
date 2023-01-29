import joi from "joi";

export const matchSchema = joi.object({
    home: joi.string().min(3).required(),
    away: joi.string().min(3).required(),
    home_goals: joi.number().integer().allow(null),
    away_goals: joi.number().integer().allow(null)
})