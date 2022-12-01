import {verifyToken} from "./verifyToken";
import {verifyAdmin} from "./verifyAdmin";

export const onlyAdmin = () => [verifyToken, verifyAdmin];
export const onlyUsers = () => [verifyToken];