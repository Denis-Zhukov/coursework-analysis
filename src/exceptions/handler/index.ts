import {RefinedException} from "./RefinedException";

export const refineException = (exception: Error) => {
    const message: string = exception.message ?? "";

    if (message.includes("connect ECONNREFUSED")) {
        return new RefinedException("Database in unavailable", 503, exception);
    }
    return new RefinedException("Unknown error", 505, exception);
};