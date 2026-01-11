import { Hono } from "hono";
import {
    createOrder,
    getMyOrders,
    getOrderById
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const orderRouter = new Hono();

// GET /orders - Lấy lịch sử đơn hàng (User phải đăng nhập)
orderRouter.get("/", authMiddleware, getMyOrders);

// POST /orders - Tạo đơn hàng mới từ giỏ hàng (User phải đăng nhập)
orderRouter.post("/", authMiddleware, createOrder);

// GET /orders/{id} - Xem chi tiết đơn hàng (User phải đăng nhập)
orderRouter.get("/:id", authMiddleware, getOrderById);

export { orderRouter };
