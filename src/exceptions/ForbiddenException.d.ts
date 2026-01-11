import { Exception } from "./Exception";

export declare class ForbiddenException extends Exception {
    public status: number;
    constructor(message?: string, status?: number);
}
