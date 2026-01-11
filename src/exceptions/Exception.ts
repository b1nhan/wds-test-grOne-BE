export class Exception extends Error {
    public status: number;
    public details: any;
    public isOperational: boolean;

    constructor(message: string, status = 500, details: any = null) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        this.details = details;
        this.isOperational = true; // Distinguishes from programming errors
        Object.setPrototypeOf(this, Exception.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
