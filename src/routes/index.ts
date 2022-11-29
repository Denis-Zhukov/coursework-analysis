import {Router} from "express";
import {productRouter} from "./products.routes";
import {categoryRouter} from "./categories.routes";
import {registrationRequestsRouter} from "./registrationRequests.routes";

const routers = Router();
routers.use(productRouter);
routers.use(categoryRouter);
routers.use(registrationRequestsRouter);

export default routers;
