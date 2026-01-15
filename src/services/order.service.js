import * as orderRepository from "../repository/order.repository.js";
import * as cartRepository from "../repository/cart.repository.js";
import * as productRepository from "../repository/product.repository.js";
import * as userRepository from "../repository/user.repository.js";
import { prisma } from "../config/prisma.js";

/**
 * Create a new order from cart
 * @param {Number} userId - User ID
 * @param {String} phone - Phone number for delivery
 * @returns {Object} Created order
 */
export const create = async (userId, phone) => {
    try {
        // Get cart items (returns { items, removedProducts })
        const cartResult = await cartRepository.getCartItems(userId);
        const cartItems = cartResult.items || [];

        // Validate cart is not empty
        if (!cartItems || cartItems.length === 0) {
            throw new Error("Giỏ hàng đang trống");
        }

        // Use transaction to ensure atomicity
        const order = await prisma.$transaction(async (tx) => {
            // Fetch all products from cart (only active/visible products - status = 1)
            const productIds = cartItems.map(item => Number(item.productId));
            const products = await productRepository.findManyByIds(productIds, tx);

            // Check if all products exist and are active
            if (products.length !== productIds.length) {
                const foundIds = products.map(p => p.id);
                const missingIds = productIds.filter(id => !foundIds.includes(id));
                throw new Error(`Một hoặc nhiều sản phẩm không còn khả dụng hoặc đã bị xóa: ${missingIds.join(", ")}`);
            }

            // Validate stock and prepare order details
            const orderDetails = [];
            let orderTotal = 0;

            for (const cartItem of cartItems) {
                const product = products.find(p => p.id === Number(cartItem.productId));
                
                if (!product) {
                    throw new Error(`Product ${cartItem.productId} not found`);
                }

                // Check stock availability
                if (product.quantity < cartItem.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${cartItem.quantity}`);
                }

                // Calculate item total
                const priceSnapshot = parseFloat(product.price);
                const itemTotal = priceSnapshot * cartItem.quantity;
                orderTotal += itemTotal;

                orderDetails.push({
                    productId: product.id,
                    quantity: cartItem.quantity,
                    priceSnapshot,
                    total: itemTotal
                });
            }

            // Create order with details using repository
            const orderData = {
                userId: Number(userId),
                total: orderTotal,
                details: orderDetails
            };
            const newOrder = await orderRepository.create(orderData, tx);

            // Update product quantities using repository
            for (const cartItem of cartItems) {
                await productRepository.updateQuantity(cartItem.productId, cartItem.quantity, tx);
            }

            // Update user's moneySpent and phone using repository
            const updateData = {
                moneySpent: {
                    increment: orderTotal
                }
            };
            
            // Update phone if provided
            if (phone) {
                updateData.phone = phone;
            }

            await userRepository.update(userId, updateData, tx);

            // Clear cart after order is created using repository
            await cartRepository.clearCartItems(userId, tx);

            return newOrder;
        });

        return order;
    } catch (error) {
        console.error("Failed to create order:", error);
        throw error;
    }
};

/**
 * Get order by ID
 * @param {Number} orderId - Order ID
 * @param {Number} userId - User ID (for authorization check)
 * @returns {Object|null} Order or null if not found
 */
export const getById = async (orderId, userId) => {
    try {
        const order = await orderRepository.getById(orderId, userId);
        return order;
    } catch (error) {
        console.error("Failed to fetch order:", error);
        throw error;
    }
};

/**
 * Get orders by user ID
 * @param {Number} userId - User ID
 * @param {Object} options - { limit, page }
 * @returns {Object} { items, pagination }
 */
export const getByUserId = async (userId, options = {}) => {
    try {
        const {
            limit = 10,
            page = 1
        } = options;

        const result = await orderRepository.getByUserId(userId, {
            limit: Math.max(1, Math.min(100, parseInt(limit) || 10)),
            page: Math.max(1, parseInt(page) || 1)
        });

        const totalPages = Math.ceil(result.totalItems / (parseInt(limit) || 10));

        return {
            items: result.items,
            pagination: {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalItems: result.totalItems,
                totalPages
            }
        };
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw error;
    }
};
