import * as cartRepository from "../repository/cart.repository.js";
import * as productRepository from "../repository/product.repository.js";

/**
 * Get cart items for user
 * @param {Number} userId - User ID
 * @returns {Object} { items: Array, removedProducts: Array, messages: Array } - Cart items and messages about removed products
 */
export const getCartItems = async (userId) => {
    try {
        const result = await cartRepository.getCartItems(userId);
        
        // Generate messages for removed products
        const messages = result.removedProducts.map(productName => 
            `Sản phẩm "${productName}" đã không còn nữa`
        );
        
        return {
            items: result.items,
            removedProducts: result.removedProducts,
            messages
        };
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
        const existingItem = await cartRepository.findCartItem(cart.id, productId);

        // Check if adding this quantity would exceed stock
        const newQuantity = existingItem 
            ? existingItem.quantity + Number(quantity)
            : Number(quantity);

        if (product.quantity < newQuantity) {
            throw new Error("Số lượng sản phẩm trong giỏ hàng vượt quá số lượng tồn kho");
        }

        // Add item to cart
        const result = await cartRepository.addItem(userId, productId, quantity);
        // Return only items, not messages (addItem already calls getCartItems which handles cleanup)
        return result.items || result;
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
        const result = await cartRepository.updateItem(userId, productId, quantity);
        // Return only items, not messages (updateItem already calls getCartItems which handles cleanup)
        return result.items || result;
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
        const result = await cartRepository.removeItem(userId, productId);
        // Return only items, not messages (removeItem already calls getCartItems which handles cleanup)
        return result.items || result;
    } catch (error) {
        console.error("Failed to remove cart item:", error);
        throw error;
    }
};
