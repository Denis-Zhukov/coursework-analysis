import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    idProduct: {
        type: mongoose.Types.ObjectId, required: true, ref: "Products",
    }, idShop: {
        type: mongoose.Types.ObjectId, required: true, ref: "Shops",
    }, price: {
        type: Number, required: true,
    }, lastUpdate: {
        type: Date, required: true,
    },
}, {versionKey: false});

export const OldPrices = mongoose.model("OldPrices", schema, "OldPrices");