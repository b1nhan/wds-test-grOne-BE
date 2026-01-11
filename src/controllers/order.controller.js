import * as orderService from "../services/order.service.js";
import { mapOrderToResponse, mapOrdersToResponse } from "../utils/order.mapper.js";

/**
 * POST /orders
 * Tạo đơn hàng mới từ giỏ hàng
 */
export const createOrder = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const body = await c.req.json();

        // Validate request body - chỉ cần phone
        if (!body.phone) {
            return c.json({
                success: false,
                message: "Số điện thoại là bắt buộc",
                statusCode: 400
            }, 400);
        }

        const order = await orderService.create(user.id, body.phone);

        return c.json({
            success: true,
            message: `Đặt hàng thành công. Mã đơn hàng #${order.id}`,
            data: mapOrderToResponse(order)
        }, 200);
    } catch (error) {
        console.error("Error in createOrder:", error);
        
        // Handle specific error messages
        if (error.message.includes("not found") || error.message.includes("Products not found")) {
            return c.json({
                success: false,
                message: error.message,
                statusCode: 404
            }, 404);
        }

        if (error.message.includes("Insufficient stock")) {
            return c.json({
                success: false,
                message: error.message,
                statusCode: 400
            }, 400);
        }

        if (error.message.includes("Giỏ hàng đang trống")) {
            return c.json({
                success: false,
                message: error.message,
                statusCode: 400
            }, 400);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi tạo đơn hàng",
            statusCode: 500
        }, 500);
    }
};

/**
 * GET /orders
 * Lấy lịch sử mua hàng của user hiện tại (theo spec)
 */
export const getMyOrders = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const result = await orderService.getByUserId(user.id, {
            limit: 100, // Lấy tất cả, không pagination theo spec
            page: 1
        });

        return c.json({
            success: true,
            message: "Lấy lịch sử đơn hàng thành công",
            data: mapOrdersToResponse(result.items) // Trả về array trực tiếp theo spec
        }, 200);
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        return c.json({
            success: false,
            message: "Có lỗi xảy ra khi lấy lịch sử mua hàng",
            statusCode: 500
        }, 500);
    }
};

/**
 * GET /orders/{id}
 * Xem chi tiết đơn hàng
 */
export const getOrderById = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const orderId = c.req.param("id");

        // Validate ID
        if (!orderId || isNaN(Number(orderId))) {
            return c.json({
                success: false,
                message: "ID đơn hàng không hợp lệ",
                statusCode: 400
            }, 400);
        }

        const order = await orderService.getById(Number(orderId), user.id);

        if (!order) {
            return c.json({
                success: false,
                message: "Đơn hàng không tồn tại",
                statusCode: 404
            }, 404);
        }

        // Check if user owns this order
        if (order.userId !== user.id) {
            return c.json({
                success: false,
                message: "Bạn không có quyền xem đơn hàng này",
                statusCode: 403
            }, 403);
        }

        return c.json({
            success: true,
            message: "Lấy thông tin đơn hàng thành công",
            data: mapOrderToResponse(order)
        }, 200);
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return c.json({
            success: false,
            message: "Có lỗi xảy ra khi lấy thông tin đơn hàng",
            statusCode: 500
        }, 500);
    }
};
