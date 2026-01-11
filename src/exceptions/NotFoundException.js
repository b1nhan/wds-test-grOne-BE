import { Exception } from "./Exception.js";

export class NotFoundException extends Exception {
    constructor(message = "Not Found", status = 404) {
        super(message, status);
        this.name = "NotFoundException";
        this.status = status;
        Object.setPrototypeOf(this, NotFoundException.prototype);

        // Maintaining proper stack trace (only on V8)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
