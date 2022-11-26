import Joi from "joi";
import {RefinedException} from "../exceptions/handler/RefinedException";

export const schemaId = ((databaseName: string) => {
    const schemas: any = {
        "MYSQL": Joi.number().min(1),
        "MONGODB": Joi.string().hex().length(24)
    }
    const schema = schemas[databaseName];
    if (!schema) throw new RefinedException("No such schemas for " + databaseName, 500);
    return schema;
})(String(process.env.USE));