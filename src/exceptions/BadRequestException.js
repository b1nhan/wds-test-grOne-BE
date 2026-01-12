import { Exception } from "./Exception.js";

export class BadRequestException extends Exception {
    constructor(message = "Bad Request", status = 400) {
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
