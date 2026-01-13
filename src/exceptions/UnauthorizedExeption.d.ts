import { Exception } from "./Exception";

export declare class UnauthorizedException extends Exception {
    public status: number;
    constructor(message?: string, status?: number);
}
