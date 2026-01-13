export class Exception extends Error {
    constructor(message, status = 500, details = null) {
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
