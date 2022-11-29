import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    idStreet: {
        type: Schema.Types.ObjectId,
        ref: "Streets"
    },
    restOfAddress: {
        type: String,
        unique: true,
    }
}, {versionKey: false});

schema.index({idStreet: 1, restOfAddress: 1}, {unique: true});

export const Addresses = mongoose.model("Addresses", schema, "addresses");