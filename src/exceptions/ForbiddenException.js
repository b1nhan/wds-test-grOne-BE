import { Exception } from "./Exception";

export class ForbiddenException extends Exception {
    constructor(message = "Forbidden", status = 403) {
        super(message, status);
        this.name = "ForbiddenException";
        this.status = status;
        Object.setPrototypeOf(this, ForbiddenException.prototype);

        // Maintaining proper stack trace (only on V8)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
