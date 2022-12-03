import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    idShop: {
        type: mongoose.Types.ObjectId,
        ref: "Shops",
        required: true
    },
    idProduct: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
        required: true
    },
    price: {
        type: mongoose.Types.ObjectId,
        ref: "Shops",
        required: true
    }
}, {versionKey: false});

export const Products = mongoose.model("CurrentPrices", schema, "current_prices");