import Joi from "joi";
import {Id} from "../types/types";
import {schemaId} from "./validationSchemas";
import {general} from "./settings";


export const validateLimitStart = (data: any, maxLimit: number = general.limit.maxDefault) => {
    const schema = Joi.object({
        _limit: Joi.number().min(general.limit.min).max(maxLimit).required(), _start: Joi.number().min(0).required(),
    });

    return schema.validate(data, {abortEarly: false});
};

export const validateId = (id: Id) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).required(),
    });

    return schema.validate({id}, {abortEarly: false});
};
