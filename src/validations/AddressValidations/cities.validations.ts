import Joi from "joi";
import {schemaId} from "../validationSchemas";
import {ICity} from "../../models/Addresses/ICity";
import {addresses as s} from "../settings";

export const validateCity = (city: ICity) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).optional(),
        idCountry: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(city, {abortEarly: false});
}