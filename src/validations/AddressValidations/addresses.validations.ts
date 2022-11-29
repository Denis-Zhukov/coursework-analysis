import Joi from "joi";
import {schemaId} from "../validationSchemas";
import {IAddress} from "../../models/Addresses/IAddress";
import {addresses as s} from "../settings";

export const validateAddress = (address: IAddress) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(schemaId).optional(),
        idStreet: Joi.alternatives().try(schemaId).required(),
        restOfAddress: Joi.string().min(s.varchar.minLength).max(s.varchar.maxLength).required(),
    });

    return schema.validate(address, {abortEarly: false});
}