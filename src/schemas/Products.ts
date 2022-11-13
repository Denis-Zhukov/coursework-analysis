import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const productsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
}, {versionKey: false});

export const Products = mongoose.model("Products", productsSchema);