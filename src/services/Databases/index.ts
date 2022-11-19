import {MongoDbService} from "./MongoDbService";
import {MySqlService} from "./MySqlService";
import {IDatabaseInstance} from "./IDatabase";
import * as dotenv from "dotenv";

dotenv.config();

const databaseType: string = String(process.env.USE);
let database: IDatabaseInstance;

switch (databaseType) {
    case "MYSQL":
        database = MySqlService.createInstance(
            String(process.env.MYSQL_HOST),
            parseInt(String(process.env?.MYSQL_PORT)),
            String(process.env?.MYSQL_USERNAME),
            String(process.env?.MYSQL_DATABASE)
        );
        import("./MySqlServices");
        break;
    case "MONGODB":
        database = MongoDbService.createInstance(String(process.env.MONGODB_URL));
        import("./MongoDbServices");
        break;
    default:
        throw new Error("No such database: " + process.env.USE);
}

export default database;