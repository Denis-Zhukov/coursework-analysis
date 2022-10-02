import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";

dotenv.config();
export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan(process.env.MORGAN_FORMAT || "tiny"));

// ROUTES AND ENDPOINTS
app.get("/", (req, res) => res.status(200).send());
