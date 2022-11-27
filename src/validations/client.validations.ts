import Joi from "joi";
import {IRegisterData} from "../models/IRegisterData";
import {client as s} from "./settings";


export const validateRegisterUserData = (data: IRegisterData) => {
    const locationSchema = Joi.object({
        country: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        city: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        street: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        restOfAddress: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).optional(),
    });

    const shopSchema = Joi.object({
        shopName: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        location: locationSchema.required(),
        getOrders: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
        getProducts: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
    });

    const schema = Joi.object({
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        email: Joi.string().email().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        password: Joi.string().pattern(s.password.regex).min(s.password.minLength).max(s.password.maxLength).required().messages({
            "string.pattern.base": s.password.error,
        }),
        shops: Joi.array().items(shopSchema).min(s.shops.minElements).max(s.shops.maxElements).required(),
    });

    return schema.validate(data, {abortEarly: false});
};