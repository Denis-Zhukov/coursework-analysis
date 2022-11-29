import {ICRUD} from "./ICRUD";
import {IRegisterData} from "../../../models/IRegisterData";
import {IResendVerifyEmail} from "../../../models/IResendVerifyEmail";
import {Id} from "../../../types/types";


export interface IRegistrationRequests extends ICRUD<IRegisterData> {
    getById(id: Id): any;

    verifyEmail(token: string): any;

    resendVerifyEmail(data: IResendVerifyEmail): any;

    acceptUser(id: Id): any;
}