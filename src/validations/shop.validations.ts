import Joi from "joi";
import {IShop} from "../models/IShop";
import {shop as s} from "./settings";
import {schemaId} from "./validationSchemas";

export const validateShopWithOutId = (shop: IShop) => {
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

    return shopSchema.validate(shop, {abortEarly: false})
}

export const validateShopWithId = (shop: IShop) => {
    const locationSchema = Joi.object({
        country: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        city: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        street: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        restOfAddress: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).optional(),
    });

    const shopSchema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        shopName: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        location: locationSchema.required(),
        getOrders: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
        getProducts: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
    });

    return shopSchema.validate(shop, {abortEarly: false})
}