import Joi from "joi";
import {Id} from "../types/types";
import {schemaId} from "./validationSchemas";

export const validateLimitStart = (data: any, maxLimit: number = Number.MAX_SAFE_INTEGER) => {
    const schema = Joi.object({
        _limit: Joi.number().min(1).max(maxLimit),
        _start: Joi.number().min(0),
    });

    return schema.validate(data, {abortEarly: false});
};

export const validateId = (id: Id) => {
    const schema = Joi.object({
            id: Joi.alternatives().try(schemaId).required()
        }
    )

    return schema.validate({id}, {abortEarly: false});
}
