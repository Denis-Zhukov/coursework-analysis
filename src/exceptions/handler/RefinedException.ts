export class RefinedException extends Error {
    public readonly message: string;
    public readonly status: number;
    public readonly realException: Error | undefined;

    constructor(message: string, status: number, realException?: Error) {
        super(message);
        this.message = message;
        this.status = status;
        this.realException = realException;
    }
}