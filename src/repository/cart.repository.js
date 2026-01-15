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
            product: true,
          },
        },
      },
    });

    // Create cart if not exists
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: Number(userId),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
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
 * @returns {Object} { items: Array, removedProducts: Array } - Cart items with visible products and messages about removed products
 */
export const getCartItems = async (userId) => {
  try {
    const cart = await getOrCreateCart(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return { items: [], removedProducts: [] };
    }

    // Filter out items with hidden/inactive/deleted products and remove them from cart
    const activeItems = [];
    const itemsToRemove = [];
    const removedProducts = []; // Store product names that were removed

    for (const item of cart.items) {
      // Check if product exists and is active/visible (status = 1)
      // If product is null (hard deleted) or status !== 1, remove from cart
      if (item.product && item.product.status === "ACTIVE") {
        activeItems.push(item);
      } else {
        // Mark for removal if product is hidden (status = 0), deleted (status = -1), inactive, or doesn't exist
        itemsToRemove.push(item.id);

        // Store product name for message if product exists
        if (item.product && item.product.name) {
          removedProducts.push(item.product.name);
        }
      }
    }

    // Remove hidden/inactive/deleted product items from cart
    if (itemsToRemove.length > 0) {
      await prisma.cartItem.deleteMany({
        where: {
          id: { in: itemsToRemove },
        },
      });
    }

    return { items: activeItems, removedProducts };
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
    const existingItem = await findCartItem(cart.id, productId);

    if (existingItem) {
      // Update quantity (add to existing)
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + Number(quantity),
        },
      });
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });
    }

    // Return updated cart items (getCartItems returns { items, removedProducts })
    const result = await getCartItems(userId);
    return result.items; // For addItem, updateItem, removeItem, we only return items
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

    const item = await findCartItem(cart.id, productId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: Number(quantity),
      },
    });

    // Return updated cart items (getCartItems returns { items, removedProducts })
    const result = await getCartItems(userId);
    return result.items; // For addItem, updateItem, removeItem, we only return items
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

    const item = await findCartItem(cart.id, productId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    // Return updated cart items (getCartItems returns { items, removedProducts })
    const result = await getCartItems(userId);
    return result.items; // For addItem, updateItem, removeItem, we only return items
  } catch (error) {
    console.error("Database error removing cart item:", error);
    throw error;
  }
};

/**
 * Find cart item by cartId and productId
 * @param {Number} cartId - Cart ID
 * @param {Number} productId - Product ID
 * @returns {Object|null} Cart item or null if not found
 */
export const findCartItem = async (cartId, productId) => {
  try {
    return await prisma.cartItem.findFirst({
      where: {
        cartId: Number(cartId),
        productId: Number(productId),
      },
    });
  } catch (error) {
    console.error("Database error finding cart item:", error);
    throw error;
  }
};

/**
 * Clear cart items (for transaction use)
 * @param {Number} userId - User ID
 * @param {Object} tx - Prisma transaction client (optional)
 */
export const clearCartItems = async (userId, tx = null) => {
  const client = tx || prisma;
  try {
    const cart = await client.cart.findFirst({
      where: { userId: Number(userId) },
    });

    if (cart) {
      await client.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  } catch (error) {
    console.error("Database error clearing cart:", error);
    throw error;
  }
};

/**
 * Clear cart items after order is created
 * @param {Number} userId - User ID
 */
export const clearCart = async (userId) => {
  return await clearCartItems(userId);
};
