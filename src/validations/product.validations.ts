import {IProduct} from "../models/IProduct";
import Joi from "joi";
import {schemaId} from "./validationSchemas";
import {product as s} from "./settings";


export const validateProductWithOutId = (product: IProduct) => {
    const schema = Joi.object({
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        description: Joi.string().min(s.description.minLength).max(s.description.maxLength).required(),
        categories: Joi.array().items(Joi.string()).min(s.categories.minElements).max(s.categories.maxElements).required(),
    });

    return schema.validate(product, {abortEarly: false});
};

export const validateProductWithId = (product: IProduct) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
        description: Joi.string().min(s.description.minLength).max(s.description.maxLength).required(),
        categories: Joi.array().items(Joi.string()).min(s.categories.minElements).max(s.categories.maxElements).required(),
    });

    return schema.validate(product, {abortEarly: false});
};