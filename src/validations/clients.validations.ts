import Joi from "joi";
import {IRegisterData} from "../models/IRegisterData";


export const validateRegisterUserData = (data: IRegisterData) => {
    const usernameError: string = `'username' length must be at least 3 characters long
'username' length must be less than 32 characters long
'username' must include only latin letters, numbers or symbol '_'
'username' must start with letter`;

    const passwordError: string = `'password' length must be at least 8 characters long
'password' length must be less than 255 characters long
'password' must be include at least 1 latin capital letter, lowercase letter, special symbol(@$!%*?&~_) and digit
'password' can include letters, special symbols(@$!%*?&~_) and digits`;

    const regexUsername = /^[A-Za-z][A-Za-z0-9_]{2,32}$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~_])[A-Za-z\d@$!%*?&~_]{8,255}$/;

    const schema = Joi.object({
        username: Joi.string().pattern(regexUsername).required().messages({
            'string.pattern.base': usernameError
        }),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(regexPassword).required().messages({
            'string.pattern.base': passwordError
        })
    });

    return schema.validate(data, {abortEarly: false});
};