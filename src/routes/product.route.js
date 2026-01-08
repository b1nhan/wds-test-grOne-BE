import { Hono } from "hono";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
// import { verifyToken } from "../middlewares/auth.middlewares.js";

const productRouter = new Hono();

// GET /products - Lấy danh sách sản phẩm (public)
productRouter.get("/", getProducts);

// GET /products/:id - Lấy chi tiết sản phẩm (public)
productRouter.get("/:id", getProductById);

// POST /products - Tạo sản phẩm mới (Admin only)
// TODO: Uncomment khi đã có middleware auth
// productRoutes.post("/", verifyToken, createProduct);
productRouter.post("/", createProduct);

// PUT /products/:id - Cập nhật sản phẩm (Admin only)
// TODO: Uncomment khi đã có middleware auth
// productRoutes.put("/:id", verifyToken, updateProduct);
productRouter.put("/:id", updateProduct);

// DELETE /products/:id - Xóa sản phẩm (Admin only)
// TODO: Uncomment khi đã có middleware auth
// productRoutes.delete("/:id", verifyToken, deleteProduct);
productRouter.delete("/:id", deleteProduct);

export { productRouter };
