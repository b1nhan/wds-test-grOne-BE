import * as cartRepository from "../repository/cart.repository.js";
import * as productRepository from "../repository/product.repository.js";
import { prisma } from "../config/prisma.js";

/**
 * Get cart items for user
 * @param {Number} userId - User ID
 * @returns {Array} Cart items
 */
export const getCartItems = async (userId) => {
    try {
        const items = await cartRepository.getCartItems(userId);
        return items;
    } catch (error) {
        console.error("Failed to fetch cart items:", error);
        throw error;
    }
};

/**
 * Add item to cart
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @param {Number} quantity - Quantity to add
 * @returns {Array} Updated cart items
 */
export const addItem = async (userId, productId, quantity) => {
    try {
        // Validate product exists
        const product = await productRepository.getOne(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        // Check stock availability
        if (product.quantity < quantity) {
            throw new Error("Sản phẩm này hiện đang hết hàng");
        }

        // Get current cart item quantity (if exists)
        const cart = await cartRepository.getOrCreateCart(userId);
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        // Check if adding this quantity would exceed stock
        const newQuantity = existingItem 
            ? existingItem.quantity + Number(quantity)
            : Number(quantity);

        if (product.quantity < newQuantity) {
            throw new Error("Số lượng sản phẩm trong giỏ hàng vượt quá số lượng tồn kho");
        }

        // Add item to cart
        const items = await cartRepository.addItem(userId, productId, quantity);
        return items;
    } catch (error) {
        console.error("Failed to add item to cart:", error);
        throw error;
    }
};

/**
 * Update item quantity in cart
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @param {Number} quantity - New quantity
 * @returns {Array} Updated cart items
 */
export const updateItem = async (userId, productId, quantity) => {
    try {
        // Validate quantity
        if (quantity < 1) {
            throw new Error("Số lượng phải lớn hơn 0");
        }

        // Validate product exists and check stock
        const product = await productRepository.getOne(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        if (product.quantity < quantity) {
            throw new Error("Sản phẩm này hiện đang hết hàng");
        }

        // Update item
        const items = await cartRepository.updateItem(userId, productId, quantity);
        return items;
    } catch (error) {
        console.error("Failed to update cart item:", error);
        throw error;
    }
};

/**
 * Remove item from cart
 * @param {Number} userId - User ID
 * @param {Number} productId - Product ID
 * @returns {Array} Updated cart items
 */
export const removeItem = async (userId, productId) => {
    try {
        const items = await cartRepository.removeItem(userId, productId);
        return items;
    } catch (error) {
        console.error("Failed to remove cart item:", error);
        throw error;
    }
};
