import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactDetails: {
        type: String,
        required: true,
    },
    shops: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "Shops"
        }],
        default: []
    }
}, {versionKey: false});

export const Accounts = mongoose.model("Accounts", schema, "accounts");