import { Exception } from "./Exception";

export class BadRequestException extends Exception {
    public status: number;

    constructor(message: string = "Bad Request", status: number = 400) {
        super(message, status);
        this.name = "BadRequestException";
        this.status = status;
        Object.setPrototypeOf(this, BadRequestException.prototype);

        // Maintaining proper stack trace (only on V8)
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
