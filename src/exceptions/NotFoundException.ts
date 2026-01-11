import { Exception } from "./Exception";

export class NotFoundException extends Exception {
    public status: number;

    constructor(message: string = "Not Found", status: number = 404) {
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
