import fs from "fs";
import path from "path";
import { success } from "zod";

/**
 * A simple global error handler.
 */
export class ErrorHandler {
    static logType = "";

    static getLogType() {
        return this.logType;
    }

    static setLogType(type) {
        this.logType = type;
    }

    /**
     * Handles an error/exception, logs and outputs a JSON response.
     * The `c` argument is an optional Hono/Express/etc. context, for framework-based output.
     * Otherwise, outputs directly to stdout (Node.js API).
     *
     * @param {Error} error
     * @param {object} [c] Optional context (e.g., Hono/Express context object)
     */
    static handleException(error, c = undefined) {
        const isProduction =
            process.env.NODE_ENV &&
            process.env.NODE_ENV.trim().toLowerCase() === "production";
        let httpCode = error.status || 500;

        // Create reference ID for this error
        const referenceId = "ERR-" + Date.now() + Math.round(Math.random() * 1e5);

        // Log full error to file
        this.logToFile(error, referenceId, c);

        let responseData = {
            success: "error",
            message: error.message || "Internal Server Error",
            statusCode: httpCode,
            reference_id: referenceId,
        };

        // if (isProduction) {
        //     responseData.message =
        //         httpCode >= 500
        //             ? `Internal Server Error. Please contact support using ID: ${referenceId}`
        //             : error.message || "Client error";
        //     responseData.details = null;
        // } else {
        //     // Development: return detailed error info
        //     responseData.details = {
        //         exception_class: error.name || error.constructor?.name || "Error",
        //         exception_code: error.code || 0,
        //         file: error.fileName || (error.stack?.split("\n")[1] || "").trim(),
        //         line: error.lineNumber || null,
        //         stackTrace: error.stack,
        //         timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
        //     };

        //     if (error.errors) responseData.details.errors = error.errors;

        //     // If error supports errors? (like Zod/UnprocessableEntityException)
        //     if (
        //         error.name === "UnprocessableEntityException" &&
        //         typeof error.getErrors === "function"
        //     ) {
        //         responseData.details.errors = error.getErrors();
        //     }

        //     if (responseData.details && typeof Object.keys === "function") {
        //         const sorted = {};
        //         Object.keys(responseData.details).sort().forEach(k => { sorted[k] = responseData.details[k] });
        //         responseData.details = sorted;
        //     }
        // }

        // Output JSON (via context or nodejs)
        if (c && typeof c.status === "function" && typeof c.json === "function") {
            return c.status(httpCode).json(responseData);
        } else if (c && typeof c.json === "function") {
            // For Hono or Express style context
            return c.json(responseData, httpCode);
        } else {
            console.error(JSON.stringify(responseData, null, 2));
        }
    }

    /**
     * Logs error detail to file.
     * @param {Error} error
     * @param {string} referenceId
     */
    static logToFile(error, referenceId, c) {
        // Place logs directory two levels up from this file
        const logDir = path.join(__dirname, "../../logs");
        if (!fs.existsSync(logDir)) {
            try { fs.mkdirSync(logDir, { recursive: true }); } catch (e) { }
        }

        // Prepare log filename by date and logType
        const now = new Date();
        const dateStr = now.toISOString().substring(0, 10); // "YYYY-MM-DD"
        const logTypePrefix =
            this.getLogType() && this.getLogType() !== ""
                ? this.getLogType() + "-"
                : "";
        const logFileName = `${logTypePrefix}error-${dateStr}.log`;
        const logFile = path.join(logDir, logFileName);

        let contextInfo = {};
        if (c && c.req) {
            contextInfo = {
                method: c.req.method,
                url: c.req.originalUrl || c.req.url,
                ip: c.req.ip
            };
        }

        // Compose log data
        const logData = {
            timestamp: now
                .toISOString()
                .replace("T", " ")
                .replace(/\..+/, ""),
            reference_id: referenceId,
            level: "CRITICAL",
            code: error.code || 0,
            message: error.message,
            file: error.fileName || (error.stack?.split("\n")[1] || "").trim(),
            line: error.lineNumber || "",
            stackTrace: error.stack,
            context: contextInfo
        };

        let logEntry = `[${logData.timestamp}] ` +
            `[${logData.level}] ` +
            `ID: ${logData.reference_id} ` +
            `Message: ${logData.message} ` +
            `(Code: ${logData.code}) in ${logData.file} on line ${logData.line}\n` +
            `Stack Trace:\n${logData.stackTrace}\n` +
            `Context: ${JSON.stringify(logData.context, null, 2)}\n` +
            "-".repeat(50) + "\n";

        // Append log
        fs.appendFile(logFile, logEntry, { encoding: "utf8" }, (err) => {
            if (err) {
                console.error("Failed to write error log:", err);
            }
        });
    }
}

export function notFoundHandler(
    c,
    next
) {
    next(new Exception(`Route not found: ${c.req.method} ${c.req.path}`, 404));
}
