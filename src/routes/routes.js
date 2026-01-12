import { Hono } from "hono";
import { productRouter } from "./product.route.js";
import { authRouter } from "./auth.route.js";
import { orderRouter } from "./order.route.js";
import { cartRouter } from "./cart.route.js";

const router = new Hono();

// Test route để debug
router.get("/test", (c) => {
  return c.json({ message: "Router is working", path: c.req.path });
});


router.route("/auth", authRouter);

// Product routes
router.route("/products", productRouter);

// Cart routes
router.route("/cart", cartRouter);

// Order routes
router.route("/orders", orderRouter);

export default router;