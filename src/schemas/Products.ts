import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const productsSchema = new Schema({
    name: String, description: String,
});

export const Products = mongoose.model("Products", productsSchema);