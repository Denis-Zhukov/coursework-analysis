import {RefinedException} from "./RefinedException";

export const refineException = (exception: Error): void => {
    const message: string = exception.message ?? "";

    if (message.includes("connect ECONNREFUSED")) {
        throw new RefinedException("Database in unavailable", 503, exception);
    }
    throw new RefinedException("Unknown error", 505, exception);
};