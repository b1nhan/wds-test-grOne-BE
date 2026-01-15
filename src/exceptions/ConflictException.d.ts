import { Exception } from "./Exception";

export declare class ConflictException extends Exception {
    public status: number;
    constructor(message?: string, status?: number);
}
