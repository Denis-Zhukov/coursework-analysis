import express from "express";
import "express-async-errors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import log4js from "log4js";

dotenv.config();

import routers from "./routes";

export const logger = log4js.getLogger();
logger.level = process.env?.LOG_LEVEL || "debug";

export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(process.env.MORGAN_FORMAT || "tiny"));
app.use("/api", routers);

//@ts-ignore
app.use((err: any, req, res, next) => {
    logger.error(err);
    if (err instanceof String && err.startsWith("connect ECONNREFUSED"))
        return res.status(500).send("Database is not available");
    return res.status(500).send(err.message);
});