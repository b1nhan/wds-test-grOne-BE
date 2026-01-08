import { LoginRequestDTO } from "../DTOs/request/auth/login-request.dto";
import { RegisterRequestDTO } from "../DTOs/request/auth/register-request.dto";
import * as authService from "../services/auth.service";
import { JwtHandler } from "../utils/jwt-handler";

export const login = async (req, res) => {
    try {
        const validation = LoginRequestDTO.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json(z.treeifyError(validation.error));
        }

        const {
            email,
            password,
            rememberMe
        } = validation.data;

        const user = await authService.login(email, password);

        // Check if the user is logged in
        const EXPIRY_LONG = 60 * 60 * 24 * 30;
        const EXPIRY_SHORT = 60 * 60;
        const expirySeconds = rememberMe ? EXPIRY_LONG : EXPIRY_SHORT;

        const jwt = JwtHandler.generateToken(user, expirySeconds);

        res.cookie("accessToken", jwt, {
            maxAge: expirySeconds * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({
            message: "Logged in successfully.",
            role: user.role,
            token: jwt,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const register = async (req, res) => {
    try {
        const validation = RegisterRequestDTO.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json(z.treeifyError(validation.error));
        }

        const {
            full_name,
            email,
            password,
            phone
        } = validation.data;

        const user = await authService.register(full_name, email, password, phone);

        return res.status(201).json({
            message: "User registered successfully.",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const logout = async (_, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const me = async (req, res) => {
    try {
        // const token = req.cookies.accessToken;
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const user = JwtHandler.validateToken(token);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}