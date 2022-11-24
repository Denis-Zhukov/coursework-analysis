import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
}, {versionKey: false});

export const Categories = mongoose.model("Categories", schema, "categories");