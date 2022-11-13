import {app} from "./app";
import {logger} from "./app";

const HOST = process.env?.HOST || "127.0.0.1";
const PORT = parseInt(String(process.env?.PORT)) || 8000;

app.listen(PORT, HOST, () => {
    logger.info(`Server running on ${HOST}:${PORT}`);
});

export {app as server};