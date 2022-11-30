import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Addresses",
        required: true,
    },
    getProducts: {
        type: String,
        required: true,
    },
    getOrders: {
        type: String,
        required: true,
    }
}, {versionKey: false});

export const Shops = mongoose.model("Shops", schema, "shops");