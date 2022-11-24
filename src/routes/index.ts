import {Router} from "express";
import {productsRouter} from "./products.routes";
import {categoriesRouter} from "./categories.routes";

const routers = Router();
routers.use(productsRouter);
routers.use(categoriesRouter);

export default routers;
