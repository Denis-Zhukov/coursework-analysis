import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    idCity: {
        type: Schema.Types.ObjectId,
        ref: "City"
    },
}, {versionKey: false});

schema.index({idCity: 1, name: 1}, {unique: true});

export const Streets = mongoose.model("Streets", schema, "streets");