import { prisma } from "../config/prisma.js";

/**
 * Get or create cart for user
 * @param {Number} userId - User ID
 * @returns {Object} Cart with items
 */
export const getOrCreateCart = async (userId) => {
    try {
        // Find existing cart
        let cart = await prisma.cart.findFirst({
            where: { userId: Number(userId) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Create cart if not exists
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: Number(userId)
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }

        return cart;
    } catch (error) {
        console.error("Database error getting cart:", error);
        throw error;
    }
};

/**
 * Get cart items for user
 * @param {Number} userId - User ID
 * @returns {Array} Cart items with products
 */
export const getCartItems = async (userId) => {
    try {
        const cart = await getOrCreateCart(userId);
        return cart.items || [];
    } catch (error) {
        console.error("Database error getting cart items:", error);
        throw error;
    }
};

/**
 * Add item to cart or update quantity if exists
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @param {Number} quantity - Quantity to add
 * @returns {Promise<any>} Cart items after update
 */
export const addItem = async (userId, productId, quantity) => {
    try {
        const cart = await getOrCreateCart(userId);

        // Check if item already exists
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        if (existingItem) {
            // Update quantity (add to existing)
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + Number(quantity)
                }
            });
        } else {
            // Create new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity: Number(quantity)
                }
            });
        }

        // Return updated cart items
        return await getCartItems(userId);
    } catch (error) {
        console.error("Database error adding cart item:", error);
        throw error;
    }
};

/**
 * Update item quantity in cart
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @param {Number} quantity - New quantity
 * @returns {Promise<any>} Cart items after update
 */
export const updateItem = async (userId, productId, quantity) => {
    try {
        const cart = await getOrCreateCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        if (!item) {
            throw new Error("Item not found in cart");
        }

        await prisma.cartItem.update({
            where: { id: item.id },
            data: {
                quantity: Number(quantity)
            }
        });

        // Return updated cart items
        return await getCartItems(userId);
    } catch (error) {
        console.error("Database error updating cart item:", error);
        throw error;
    }
};

/**
 * Remove item from cart
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @returns {Promise<any>} Cart items after removal
 */
export const removeItem = async (userId, productId) => {
    try {
        const cart = await getOrCreateCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        if (!item) {
            throw new Error("Item not found in cart");
        }

        await prisma.cartItem.delete({
            where: { id: item.id }
        });

        // Return updated cart items
        return await getCartItems(userId);
    } catch (error) {
        console.error("Database error removing cart item:", error);
        throw error;
    }
};

/**
 * Clear cart items after order is created
 * @param {Number} userId - User ID
 */
export const clearCart = async (userId) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId: Number(userId) }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }
    } catch (error) {
        console.error("Database error clearing cart:", error);
        throw error;
    }
};
