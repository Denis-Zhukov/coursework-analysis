import {RefinedException} from "../exceptions/handler/RefinedException";
import {refineException} from "../exceptions/handler";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {ICurrentPricesService} from "../services/Databases/interfaces/ICurrentPricesService";
import {Id} from "../types/types";
import axios from "axios";


export class CurrentPricesController {
    public static async loadPrices(idShop: Id, url: string) {
        let data: any = (await axios.get(url)).data;
        try {
            data = data.map((el: any) => ({...el, id: el.id_analysis, idShop}));
            const service = database.getService(services.currentPrices) as ICurrentPricesService;
            await service.delete(idShop);
            service.addMany(data);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }
}