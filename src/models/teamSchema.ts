import joi from "joi";

export const teamSchema = joi.object({
    name: joi.string().min(3).required()
});