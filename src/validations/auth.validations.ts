import {ILoginData} from "../models/ILoginData";
import Joi from "joi";
import {client as s} from "./settings";

export const validateLoginData = (data: ILoginData) => {
    const schema = Joi.object({
        username: Joi.string().pattern(s.username.regex).min(s.username.minLength).max(s.username.maxLength).required().messages({
            "string.pattern.base": s.username.error,
        }),
        password: Joi.string().pattern(s.password.regex).min(s.password.minLength).max(s.password.maxLength).required().messages({
            "string.pattern.base": s.password.error,
        }),
    })

    return schema.validate(data, {abortEarly: false});
}