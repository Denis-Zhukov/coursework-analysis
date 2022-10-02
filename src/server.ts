import log4js from "log4js";
import {app} from "./app";

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL || "debug";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = parseInt(String(process.env.PORT)) || 8000;

app.listen(PORT, HOST, () => {
    logger.info(`Server running on ${HOST}:${PORT}`);
});