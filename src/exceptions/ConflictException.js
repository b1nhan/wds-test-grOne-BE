import { Exception } from "./Exception.js";

export class ConflictException extends Exception {
    constructor(message = "Conflict", status = 409) {
        super(message, status);
        this.name = "ConflictException";
        this.status = status;
        Object.setPrototypeOf(this, ConflictException.prototype);

        // Maintaining proper stack trace (only on V8)
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
