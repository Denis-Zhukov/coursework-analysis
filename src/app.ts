import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";

import routers from "./routes";

dotenv.config();
export const app = express();
console.log(process.env.MORGAN_FORMAT);
// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(process.env.MORGAN_FORMAT || "tiny"));
app.use("/api", routers);
