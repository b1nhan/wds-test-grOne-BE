import { Exception } from "./Exception";

export class UnauthorizedException extends Exception {
    public status: number;

    constructor(message: string = "Unauthorized", status: number = 401) {
        super(message, status);
        this.name = "UnauthorizedException";
        this.status = status;
        Object.setPrototypeOf(this, UnauthorizedException.prototype);

        // Maintaining proper stack trace (only on V8)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
