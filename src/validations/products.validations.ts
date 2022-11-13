import {IProduct} from "../models/IProduct";
import Joi from "joi";


export const validateProductWithOutId = (product: IProduct) => {
    const schema = Joi.object({
        name: Joi.string().required(), description: Joi.string().required(),
    });

    return schema.validate(product, {abortEarly: false});
};

export const validateProductWithId = (product: IProduct) => {
    const schema = Joi.object({
        _id: Joi.alternatives()
            .try(Joi.number().min(1), Joi.string().hex().length(24)).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
    });

    return schema.validate(product, {abortEarly: false});
};