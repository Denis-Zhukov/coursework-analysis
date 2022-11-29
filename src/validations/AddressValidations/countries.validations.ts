import Joi from "joi";
import {schemaId} from "../validationSchemas";
import {client as s} from "../settings";
import {ICountry} from "../../models/Addresses/ICountry";

export const validateCountry = (country: ICountry) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).optional(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(country, {abortEarly: false});
}