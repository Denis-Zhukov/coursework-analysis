import express from "express";
import "express-async-errors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import log4js from "log4js";

dotenv.config();

import routers from "./routes";
import {RefinedException} from "./exceptions/handler/RefinedException";

export const logger = log4js.getLogger();
logger.level = process.env?.LOG_LEVEL || "debug";

export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(process.env.MORGAN_FORMAT || "tiny"));
app.use("/api", routers);

//@ts-ignore
app.use((err: RefinedException, req, res, next) => {
    logger.error(`message: ${err.realException?.message}
status:${err.status}
defined message:${err.message}
`, err.realException);
    return res.status(err.status).send(err.message);
});