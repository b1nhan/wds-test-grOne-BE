/**
 * Map cart item to response format (theo spec)
 */
export const mapCartItemToResponse = (cartItem) => {
    if (!cartItem || !cartItem.product) {
        return null;
    }

    const product = cartItem.product;
    const price = Number(product.price);
    const quantity = cartItem.quantity;
    const totalPrice = price * quantity;

    return {
        product: {
            id: product.id,
            name: product.name,
            price: Math.round(price), // Convert to integer (VND)
            imageUrl: product.imageUrl || null
        },
        quantity: quantity,
        totalPrice: Math.round(totalPrice) // Convert to integer (VND)
    };
};

/**
 * Map array of cart items to response format
 */
export const mapCartItemsToResponse = (cartItems) => {
    if (!Array.isArray(cartItems)) return [];
    return cartItems
        .map(mapCartItemToResponse)
        .filter(item => item !== null); // Filter out null items
};
