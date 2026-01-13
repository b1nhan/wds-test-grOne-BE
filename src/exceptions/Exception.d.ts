export class Exception extends Error {
    public status: number;
    public details: any;
    public isOperational: boolean;

    constructor(message: string, status?: number, details?: any);
}
