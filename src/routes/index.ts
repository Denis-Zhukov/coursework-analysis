import {Router} from "express";
import {productRouter} from "./products.routes";
import {categoryRouter} from "./categories.routes";
import {registrationRequestsRouter} from "./registrationRequests.routes";
import {accountRouter} from "./accounts.routes";
import {shopRouter} from "./shops.routes";
import {countryRouter} from "./AdressRoutes/countries.routes";
import {cityRouter} from "./AdressRoutes/cities.routes";
import {streetRouter} from "./AdressRoutes/streets.routes";
import {addressRouter} from "./AdressRoutes/addresses.routes";

const routers = Router();
routers.use(productRouter);
routers.use(categoryRouter);
routers.use(registrationRequestsRouter);
routers.use(accountRouter);
routers.use(shopRouter);
routers.use("/countries", countryRouter);
routers.use("/cities", cityRouter);
routers.use("/streets", streetRouter);
routers.use("/addresses", addressRouter);

export default routers;
