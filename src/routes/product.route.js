import { Hono } from "hono";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
// import { verifyToken } from "../middlewares/auth.middlewares.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middlewares.js";


const productRouter = new Hono();

// GET /products - Lấy danh sách sản phẩm (public)
productRouter.get("/", getProducts);

// GET /products/:id - Lấy chi tiết sản phẩm (public)
productRouter.get("/:id", getProductById);

// POST /products - Tạo sản phẩm mới (Admin only)
productRouter.post("/", authMiddleware, adminMiddleware, createProduct);

// PUT /products/:id - Cập nhật sản phẩm (Admin only)
productRouter.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// DELETE /products/:id - Xóa sản phẩm (Admin only)
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export { productRouter };
