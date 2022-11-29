import Joi from "joi";
import {IRegisterData} from "../models/IRegisterData";
import {client, client as s} from "./settings";
import {validate, version} from "uuid";
import {IResendVerifyEmail} from "../models/IResendVerifyEmail";
import {schemaId} from "./validationSchemas";


export const validateRegisterUserData = (data: IRegisterData) => {
    const schema = Joi.object({
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        password: Joi.string().pattern(s.password.regex).min(s.password.minLength).max(s.password.maxLength).required().messages({
            "string.pattern.base": s.password.error,
        }),
        contactDetails: Joi.string().min(client.contactDetails.minLength).max(client.contactDetails.maxLength).required(), // shops: Joi.array().items(shopSchema).min(s.shops.minElements).max(s.shops.maxElements).required(),
    });

    return schema.validate(data, {abortEarly: false});
};

export const validateVerifyToken = (token: string) => {
    const isToken = validate(token);
    if (!isToken) return {error: "Incorrect token"};

    const ver = version(token);
    if (ver !== 4) return {error: "Incorrect token"};
    return {};
};

export const validateResendVerifyEmail = (data: IResendVerifyEmail) => {
    const schema = Joi.object({email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required()});

    return schema.validate(data, {abortEarly: false});
};

export const validateUpdateRegistrationRequest = (data: IRegisterData) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        password: Joi.string().pattern(s.password.regex).min(s.password.minLength).max(s.password.maxLength).optional().messages({
            "string.pattern.base": s.password.error,
        }),
        contactDetails: Joi.string().min(client.contactDetails.minLength).max(client.contactDetails.maxLength).required(),
        confirmed: Joi.boolean().required(),
    });

    return schema.validate(data, {abortEarly: false});
};