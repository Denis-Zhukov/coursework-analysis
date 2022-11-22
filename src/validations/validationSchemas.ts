import Joi from "joi";

export const schemaId = process.env.USE == "MYSQL" ? Joi.number().min(1) : Joi.string().hex().length(24);