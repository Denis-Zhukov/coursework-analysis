import {IProduct} from "../interfaces/IProduct";
import Joi from "joi";

export const validateProduct = (product: IProduct) => {
    const schema = Joi.object({
        name: Joi.string().required(), description: Joi.string().required(),
    });

    return schema.validate(product);
};