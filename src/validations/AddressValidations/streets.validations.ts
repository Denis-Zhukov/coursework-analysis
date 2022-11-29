import Joi from "joi";
import {schemaId} from "../validationSchemas";
import {IStreet} from "../../models/Addresses/IStreet";
import {addresses as s} from "../settings";

export const validateStreet = (street: IStreet) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).optional(),
        idCity: Joi.alternatives().try(schemaId).required(),
        name: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(street, {abortEarly: false});
}