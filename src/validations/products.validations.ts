import {IProduct} from "../interfaces/IProduct";
import Joi from "joi";
import {Id} from "../types/types";


export const validateProduct = (product: IProduct) => {
    const schema = Joi.object({
        name: Joi.string().required(), description: Joi.string().required(),
    });

    return schema.validate(product, {abortEarly: false});
};

export const validateUpdateProduct = (product: IProduct & { oldId: Id | undefined }) => {
    const schema = Joi.object({
        oldId: Joi.alternatives().try(Joi.number(), Joi.string().hex().length(24)).optional(),
        _id: Joi.alternatives().try(Joi.number().min(1), Joi.string().hex().length(24)).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
    });

    return schema.validate(product, {abortEarly: false});
};