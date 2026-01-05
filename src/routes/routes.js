import { Hono } from "hono";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

const router = new Hono();

// Test route để debug
router.get("/test", (c) => {
  return c.json({ message: "Router is working", path: c.req.path });
});

// Product routes - define directly here
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;