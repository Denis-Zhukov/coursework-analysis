import express from "express";
import "express-async-errors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import log4js from "log4js";
import routers from "./routes";
import cookieParser from "cookie-parser";
import {RefinedException} from "./exceptions/handler/RefinedException";

dotenv.config();

export const logger = log4js.getLogger();
logger.level = process.env?.LOG_LEVEL || "debug";

export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(morgan(process.env.MORGAN_FORMAT || "tiny"));
app.use("/api", routers);

//@ts-ignore
app.use((err: RefinedException, req, res, next) => {
    logger.error(`ERROR
    message: ${err.realException?.message ?? "-"}
    status: ${err.status}
    defined message: ${err.message}
    `, err.realException || "");
    return res.status(err.status || 500).send(err?.realException?.message || "Unknown error");
});