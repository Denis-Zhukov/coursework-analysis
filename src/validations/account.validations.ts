import {IAccount} from "../models/IAccount";
import Joi from "joi";
import {client, client as s} from "./settings";
import {schemaId} from "./validationSchemas";


export const validateAccountWithoutId = (acc: IAccount) => {
    const schema = Joi.object({
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        password: Joi.string().pattern(s.password.regex).min(s.password.minLength).max(s.password.maxLength).required().messages({
            "string.pattern.base": s.password.error,
        }),
        contactDetails: Joi.string().min(client.contactDetails.minLength).max(client.contactDetails.maxLength).required(),
    });

    return schema.validate(acc, {abortEarly: false});
}

export const validateAccountWithId = (acc: IAccount) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        contactDetails: Joi.string().min(client.contactDetails.minLength).max(client.contactDetails.maxLength).required(),
    });

    return schema.validate(acc, {abortEarly: false});
}