import { Exception } from "./Exception";

export declare class NotFoundException extends Exception {
    public status: number;
    constructor(message?: string, status?: number);
}
