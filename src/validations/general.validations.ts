import Joi from "joi";

export const validateLimitStart = (data: any, maxLimit: number = 10) => {
    const schema = Joi.object({
        _limit: Joi.number().min(1).max(maxLimit), _start: Joi.number().min(0),
    });

    return schema.validate(data);
};