import {ICRUD} from "./ICRUD";
import {IRegisterData} from "../../../models/IRegisterData";


export interface IClient extends ICRUD<IRegisterData> {
    sendRequestToRegister(data: IRegisterData): any;
}