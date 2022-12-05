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
import {authRouter} from "./auth.routes";
import {eventer} from "../services/Eventer";

const routers = Router();
routers.use("/products", productRouter);
routers.use("/categories", categoryRouter);
routers.use("/registration-requests", registrationRequestsRouter);
routers.use("/accounts", accountRouter);
routers.use("/shops", shopRouter);
routers.use("/countries", countryRouter);
routers.use("/cities", cityRouter);
routers.use("/streets", streetRouter);
routers.use("/addresses", addressRouter);
routers.use("/auth", authRouter);

routers.get("/test", eventer);

export default routers;
