import {Router} from "express";
import {productRouter} from "./products.routes";
import {categoryRouter} from "./categories.routes";
import {clientRouter} from "./clients.routes";

const routers = Router();
routers.use(productRouter);
routers.use(categoryRouter);
routers.use(clientRouter);

export default routers;
