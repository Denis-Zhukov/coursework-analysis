import {Router} from "express";
import {productRouter} from "./products.routes";
import {categoryRouter} from "./categories.routes";
import {registrationRequestsRouter} from "./registrationRequests.routes";
import {accountRouter} from "./accounts.routes";

const routers = Router();
routers.use(productRouter);
routers.use(categoryRouter);
routers.use(registrationRequestsRouter);
routers.use(accountRouter);

export default routers;
