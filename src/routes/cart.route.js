import { Hono } from "hono";
import {
    getCart,
    addItem,
    updateItem,
    removeItem
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const cartRouter = new Hono();

// Tất cả routes đều cần authentication
cartRouter.use("*", authMiddleware);

// GET /cart - Lấy giỏ hàng
cartRouter.get("/", getCart);

// POST /cart/items - Thêm sản phẩm vào giỏ
cartRouter.post("/items", addItem);

// PATCH /cart/items/{id} - Cập nhật số lượng
cartRouter.patch("/items/:id", updateItem);

// DELETE /cart/items/{id} - Xóa sản phẩm khỏi giỏ
cartRouter.delete("/items/:id", removeItem);

export { cartRouter };
