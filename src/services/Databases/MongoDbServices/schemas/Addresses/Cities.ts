import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    idCountry: {
        type: Schema.Types.ObjectId,
        ref: "Countries"
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {versionKey: false});

schema.index({idCountry: 1, name: 1}, {unique: true});

export const Cities = mongoose.model("Cities", schema, "cities");