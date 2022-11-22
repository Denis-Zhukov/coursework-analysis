import {IProduct} from "../models/IProduct";
import Joi from "joi";
import {schemaId} from "./general.validations";
import * as dotenv from "dotenv";

dotenv.config();

export const validateProductWithOutId = (product: IProduct) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        categories: Joi.array().items(Joi.string()).min(1).required()
    });

    return schema.validate(product, {abortEarly: false});
};

export const validateProductWithId = (product: IProduct) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        categories: Joi.array().items(Joi.string()).min(1).required()
    });

    return schema.validate(product, {abortEarly: false});
};