import Joi from "joi";
import {IShop} from "../models/IShop";
import {shop as s} from "./settings";
import {schemaId} from "./validationSchemas";

export const validateShop = (shop: IShop) => {
    const shopSchema = Joi.object({
        id: Joi.alternatives().try(schemaId).optional(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        address: Joi.alternatives().try(schemaId).required(),
        getOrders: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
        getProducts: Joi.string().uri().min(s.text.minLength).max(s.text.maxLength).required(),
    });

    return shopSchema.validate(shop, {abortEarly: false})
}