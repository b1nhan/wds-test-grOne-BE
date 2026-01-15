import * as cartService from "../services/cart.service.js";
import { mapCartItemsToResponse } from "../utils/cart.mapper.js";

/**
 * GET /cart
 * Lấy giỏ hàng hiện tại
 */
export const getCart = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const result = await cartService.getCartItems(user.id);

        return c.json({
            success: true,
            message: "Lấy thông tin giỏ hàng thành công",
            data: {
                items: mapCartItemsToResponse(result.items || result),
                messages: result.messages || []
            }
        }, 200);
    } catch (error) {
        console.error("Error in getCart:", error);
        return c.json({
            success: false,
            message: "Có lỗi xảy ra khi lấy thông tin giỏ hàng",
            statusCode: 500
        }, 500);
    }
};

/**
 * POST /cart/items
 * Thêm sản phẩm vào giỏ hàng
 */
export const addItem = async (c) => {
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

        // Validate request body
        if (!body.productId || body.quantity === undefined) {
            return c.json({
                success: false,
                message: "productId và quantity là bắt buộc",
                statusCode: 400
            }, 400);
        }

        if (body.quantity < 1) {
            return c.json({
                success: false,
                message: "Số lượng phải lớn hơn 0",
                statusCode: 400
            }, 400);
        }

        const items = await cartService.addItem(
            user.id,
            body.productId,
            body.quantity || 1
        );

        return c.json({
            success: true,
            message: "Đã thêm sản phẩm vào giỏ hàng",
            data: mapCartItemsToResponse(items)
        }, 200);
    } catch (error) {
        console.error("Error in addItem:", error);

        if (error.message.includes("không tồn tại") || 
            error.message.includes("hết hàng") ||
            error.message.includes("vượt quá")) {
            return c.json({
                success: false,
                message: error.message,
                statusCode: 400
            }, 400);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
            statusCode: 500
        }, 500);
    }
};

/**
 * PATCH /cart/items/{id}
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const updateItem = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const productId = c.req.param("id");
        const body = await c.req.json();

        // Validate ID
        if (!productId || isNaN(Number(productId))) {
            return c.json({
                success: false,
                message: "ID sản phẩm không hợp lệ",
                statusCode: 400
            }, 400);
        }

        // Validate quantity
        if (!body.quantity || body.quantity < 1) {
            return c.json({
                success: false,
                message: "Số lượng phải lớn hơn 0",
                statusCode: 400
            }, 400);
        }

        const items = await cartService.updateItem(
            user.id,
            Number(productId),
            body.quantity
        );

        return c.json({
            success: true,
            message: "Cập nhật số lượng sản phẩm thành công",
            data: mapCartItemsToResponse(items)
        }, 200);
    } catch (error) {
        console.error("Error in updateItem:", error);

        if (error.message.includes("not found in cart")) {
            return c.json({
                success: false,
                message: "Sản phẩm không tồn tại trong giỏ hàng",
                statusCode: 404
            }, 404);
        }

        if (error.message.includes("không tồn tại") || 
            error.message.includes("hết hàng")) {
            return c.json({
                success: false,
                message: error.message,
                statusCode: 400
            }, 400);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi cập nhật số lượng",
            statusCode: 500
        }, 500);
    }
};

/**
 * DELETE /cart/items/{id}
 * Xóa sản phẩm khỏi giỏ hàng
 */
export const removeItem = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }, 401);
        }

        const productId = c.req.param("id");

        // Validate ID
        if (!productId || isNaN(Number(productId))) {
            return c.json({
                success: false,
                message: "ID sản phẩm không hợp lệ",
                statusCode: 400
            }, 400);
        }

        const items = await cartService.removeItem(user.id, Number(productId));

        return c.json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng",
            data: mapCartItemsToResponse(items)
        }, 200);
    } catch (error) {
        console.error("Error in removeItem:", error);

        if (error.message.includes("not found in cart")) {
            return c.json({
                success: false,
                message: "Sản phẩm không tồn tại trong giỏ hàng",
                statusCode: 404
            }, 404);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi xóa sản phẩm",
            statusCode: 500
        }, 500);
    }
};
