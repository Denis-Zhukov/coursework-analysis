import {MongoDbService} from "./MongoDbService";
import {MySqlService} from "./MySqlService";
import {IDatabaseService} from "./IDatabaseService";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import {logger} from "../app";

dotenv.config();

const databaseType: string = String(process.env.USE);
let database: IDatabaseService;
switch (databaseType) {
    case "MYSQL":
        database = new MySqlService(String(process.env.MYSQL_HOST), parseInt(String(process.env?.MYSQL_PORT)), String(process.env?.MYSQL_USERNAME), String(process.env?.MYSQL_DATABASE));
        break;
    case "MONGODB":
        database = new MongoDbService(String(process.env.MONGODB_URL));
        break;
    default:
        throw new Error("No such database: " + process.env.USE);
}

export default database;