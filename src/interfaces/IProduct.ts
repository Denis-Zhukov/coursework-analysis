import * as mongoose from "mongoose";

export interface IProduct {
    _id: number | mongoose.Types.ObjectId;
    name: string;
    description: string;
}