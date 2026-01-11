import { Exception } from "./Exception";

export declare class BadRequestException extends Exception {
    public status: number;
    constructor(message?: string, status?: number);
}
