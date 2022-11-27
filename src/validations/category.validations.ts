import Joi from "joi";
import {schemaId} from "./validationSchemas";
import {ICategory} from "../models/ICategory";
import {category as s} from "./settings";


export const validateCategoryWithOutId = (category: ICategory) => {
    const schema = Joi.object({
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(category, {abortEarly: false});
};

export const validateCategoryWithId = (category: ICategory) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(category, {abortEarly: false});
};