import { JwtHandler } from "../utils/jwt-handler";

export class JwtVerify {
    static verify(req) {
        const token = this.getBearerToken(req);

        if (!token) {
            throw new Error("Missing authorization token");
        }

        const user = JwtHandler.validateToken(token);

        if (!user) {
            throw new Error("Invalid token format or claims.", 401);
        }

        return user; // Authenticated → return user info as needed
    }

    static getBearerToken(req) {
        let authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (authHeader && typeof authHeader === 'string') {
            const match = authHeader.match(/Bearer\s+(\S+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
}