import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {versionKey: false});

export const Countries = mongoose.model("Countries", schema, "countries");