import {ICRUD} from "./ICRUD";
import {IRegisterData} from "../../../models/IRegisterData";
import {IResendVerifyEmail} from "../../../models/IResendVerifyEmail";


export interface IClient extends ICRUD<IRegisterData> {
    verifyEmail(token: string): any;

    resendVerifyEmail(data: IResendVerifyEmail): any;

}