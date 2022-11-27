import * as mongoose from "mongoose";

const Schema = mongoose.Schema;


const schema = new Schema({
    username: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactDetails: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    confirmed: {
        type:Boolean,
        default:false
    },
}, {versionKey: false});

export const RegistrationRequests = mongoose.model("RegistrationRequests", schema, "registration_requests");