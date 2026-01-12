import { LoginRequestDTO } from "../DTOs/request/auth/login-request.dto.js";
import { RegisterRequestDTO } from "../DTOs/request/auth/register-request.dto.js";
import * as authService from "../services/auth.service.js";
import { JwtHandler } from "../utils/jwt-handler.js";
import { setCookie } from "hono/cookie";
import { z } from "zod";

export const login = async (c) => {
    try {
        const body = await c.req.json();
        const validation = LoginRequestDTO.safeParse(body);

        if (!validation.success) {
            return c.json(z.treeifyError(validation.error), 400);
        }

        const {
            email,
            password,
            rememberMe
        } = validation.data;

        const user = await authService.login(email, password);

        // Check if the user is logged in
        const EXPIRY_LONG = 60 * 60 * 24 * 30; // 30 days in seconds
        const EXPIRY_SHORT = 60 * 60;          // 1 hour in seconds
        const expirySeconds = rememberMe ? EXPIRY_LONG : EXPIRY_SHORT;

        const jwt = JwtHandler.generateToken(user, expirySeconds);

        //tính bằng SECONDS (giây) thay cho MS
        setCookie(c, "accessToken", jwt, {
            maxAge: expirySeconds,
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
        });

        return c.json({
            success: true,
            message: "Thao tác thành công",
            data: {
                role: user.role,
                token: jwt,
            }
        }, 200);
    } catch (error) {
        console.error(error);

        const message = error.message || "Internal server error.";

        return c.json({
            success: false,
            message,
            statusCode: error.status || 500
        }, error.status || 500);
    }
}

export const register = async (c) => {
    try {
        const body = await c.req.json();
        const validation = RegisterRequestDTO.safeParse(body);

        if (!validation.success) {
            return c.json(z.treeifyError(validation.error), 400);
        }

        const {
            full_name,
            email,
            password,
            phone
        } = validation.data;

        const user = await authService.register(full_name, email, password, phone);

        return c.json({
            success: true,
            message: "User registered successfully.",
            data: user,
        }, 201);
    } catch (error) {
        console.error(error);
        return c.json({
            success: false,
            message: error.message || "Internal server error.",
            statusCode: error.status || 500
        }, error.status || 500);
    }
}

export const me = async (c) => {
    try {
        const authHeader = c.req.header('Authorization') || c.req.header('authorization');

        if (!authHeader) {
            return c.json({ message: "Unauthorized." }, 401);
        }

        // remove "Bearer"
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const user = JwtHandler.validateToken(token);
        return c.json({
            success: true,
            message: "Lấy thông tin profile thành công",
            data: user
        }, 200);
    } catch (error) {
        console.error(error);
        return c.json({
            success: false,
            message: error.message || "Internal server error.",
            statusCode: error.status || 500
        }, error.status || 500);
    }
}