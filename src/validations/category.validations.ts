import Joi from "joi";
import {schemaId} from "./validationSchemas";
import * as dotenv from "dotenv";
import {ICategory} from "../models/ICategory";

dotenv.config();

export const validateCategoryWithOutId = (category: ICategory) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });

    return schema.validate(category, {abortEarly: false});
};

export const validateCategoryWithId = (category: ICategory) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().required(),
    });

    return schema.validate(category, {abortEarly: false});
};