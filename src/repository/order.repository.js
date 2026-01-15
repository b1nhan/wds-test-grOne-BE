import { prisma } from "../config/prisma.js";

/**
 * Create a new order with order details
 * @param {Object} orderData - { userId, total, details: [{ productId, quantity, priceSnapshot, total }] }
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Promise<any>} Created order with details
 */
export const create = async (orderData, tx = null) => {
    const client = tx || prisma;
    try {
        const { userId, total, details } = orderData;

        // Create order
        const newOrder = await client.order.create({
            data: {
                userId,
                total: parseFloat(total),
                details: {
                    create: details.map(detail => ({
                        productId: detail.productId,
                        quantity: detail.quantity,
                        priceSnapshot: parseFloat(detail.priceSnapshot),
                        total: parseFloat(detail.total),
                    }))
                }
            },
            include: {
                user: {
                    select: {
                        phone: true
                    }
                },
                details: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return newOrder;
    } catch (error) {
        console.error("Database error creating order:", error);
        throw error;
    }
};

/**
 * Get orders by user ID with pagination
 * @param {Number} userId - User ID
 * @param {Object} options - { limit, page }
 * @returns {Promise<any>} { items, totalItems }
 */
export const getByUserId = async (userId, options = {}) => {
    try {
        const {
            limit = 10,
            page = 1
        } = options;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Get total count
        const totalItems = await prisma.order.count({
            where: { userId: Number(userId) }
        });

        // Get orders with details and user info
        const items = await prisma.order.findMany({
            where: { userId: Number(userId) },
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        phone: true
                    }
                },
                details: {
                    include: {
                        product: true // Include product even if deleted (will be null if deleted)
                    }
                }
            }
        });

        return {
            items,
            totalItems
        };
    } catch (error) {
        console.error("Database error fetching orders:", error);
        throw error;
    }
};

/**
 * Get order by ID
 * @param {Number} orderId - Order ID
 * @param {Number} userId - User ID (optional, for authorization check)
 * @returns {Promise<any>} Order or null if not found
 */
export const getById = async (orderId, userId = null) => {
    try {
        const where = { id: Number(orderId) };
        if (userId !== null) {
            where.userId = Number(userId);
        }

        const order = await prisma.order.findFirst({
            where,
            include: {
                user: {
                    select: {
                        phone: true
                    }
                },
                details: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return order;
    } catch (error) {
        console.error("Database error fetching order:", error);
        throw error;
    }
};
