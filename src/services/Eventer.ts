import database from "./Databases";
import {services} from "./Databases/services";


export const eventer = async (req: any, res: any) => {
    const shops = await database.getService(services.shop).get(50, 0);
    console.log(shops);
    return await res.send();
}