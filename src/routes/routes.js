import { Hono } from "hono";
import { productRouter } from "./product.route.js";
import { authRouter } from "./auth.route.js";

const router = new Hono();

// Test route để debug
router.get("/test", (c) => {
  return c.json({ message: "Router is working", path: c.req.path });
});


router.use("/auth", authRouter);

// Product routes
router.use("/products", productRouter);

export default router;