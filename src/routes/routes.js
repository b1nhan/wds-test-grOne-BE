import { Hono } from "hono";
import { productRoutes } from "./product.route";

const router = new Hono();

router.use("/products", productRoutes);

export default router;