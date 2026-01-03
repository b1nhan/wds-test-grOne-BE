import { Hono } from "hono";
import { searchProducts } from "../controllers/product.controller.js";

const productRoutes = new Hono();

productRoutes.get("/products", searchProducts);

export { productRoutes };
