import { Hono } from "hono";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";


const authRouter = new Hono();

authRouter.post("/login", login);
authRouter.post("/register", register);
// authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, me);

export { authRouter };