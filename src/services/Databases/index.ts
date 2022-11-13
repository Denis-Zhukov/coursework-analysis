import {MongoDbService} from "./MongoDbService";
import {MySqlService} from "./MySqlService";
import {IDatabaseService} from "./IDatabaseService";
import * as dotenv from "dotenv";

dotenv.config();

const databaseType: string = String(process.env.USE);
let database: IDatabaseService;

switch (databaseType) {
    case "MYSQL":
        database = MySqlService.createInstance(
            String(process.env.MYSQL_HOST),
            parseInt(String(process.env?.MYSQL_PORT)),
            String(process.env?.MYSQL_USERNAME),
            String(process.env?.MYSQL_DATABASE)
        );
        break;
    case "MONGODB":
        try {
            database = MongoDbService.createInstance(String(process.env.MONGODB_URL));
        } catch (e) {
            console.log("index.ts");
            database = MongoDbService.createInstance(String(process.env.MONGODB_URL));
        }
        break;
    default:
        throw new Error("No such database: " + process.env.USE);
}

export default database;