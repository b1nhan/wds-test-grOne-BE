import jwt from 'jsonwebtoken';

export class JwtHandler {
    static encrAlgos = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "none"];

    static getSecretKey() {
        const key = process.env.JWT_SECRET_KEY;
        if (!key) {
            // Throw error as runtime/config error
            throw new Error("JWT_SECRET_KEY is missing or empty in environment configuration.");
        }
        return key;
    }

    /**
     * @param {object} user - user object (should have user_id, name, email, role)
     * @param {number} expireTime - token expiry in seconds
     */
    static generateToken(user, expireTime = 3600) {
        const issuedAt = Math.floor(Date.now() / 1000);
        const expirationTime = issuedAt + expireTime;

        const payload = {
            iss: process.env.HOST || 'localhost',
            sub: user.user_id,
            aud: process.env.HOST || 'localhost',
            iat: issuedAt,
            exp: expirationTime,
            fullname: user.full_name,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, this.getSecretKey(), { algorithm: this.encrAlgos[0] });
    }

    /**
     * Validates a JWT token and extracts user information.
     * @param {string} token - JWT token
     * @returns {{id: string, email: string, name: string|null, role: string|number|null}} User info object
     * @throws Error on validation failure
     */
    static validateToken(token) {
        try {
            const decoded = jwt.verify(token, this.getSecretKey(), { algorithms: [this.encrAlgos[0]] });

            const requiredClaimsExist =
                decoded.sub &&
                decoded.email &&
                decoded.email !== "";

            if (!requiredClaimsExist) {
                throw new Error("Token is missing required claims.");
            }

            return {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name ?? null,
                role: decoded.role ?? "user"
            };
        } catch (err) {
            const unauthorizedError = new Error("Token validation failed: " + err.message);
            unauthorizedError.statusCode = 401;
            throw unauthorizedError;
        }
    }
}
