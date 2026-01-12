/**
 * Map order detail to CartItem format (theo spec)
 * Handles deleted products gracefully
 */
export const mapOrderDetailToCartItem = (detail) => {
    const product = detail.product;
    const price = product ? parseFloat(product.price) : parseFloat(detail.priceSnapshot);
    
    return {
        product: product ? {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            description: product.description,
            imageUrl: product.imageUrl,
            stock: product.quantity,
            createdAt: product.createdAt
        } : {
            // Product was deleted after order was placed
            id: detail.productId,
            name: "Sản phẩm đã bị xóa",
            price: parseFloat(detail.priceSnapshot),
            description: null,
            imageUrl: null,
            stock: 0,
            createdAt: null
        },
        quantity: detail.quantity,
        totalPrice: parseFloat(detail.total)
    };
};

/**
 * Map order to response format (theo spec API)
 * Spec yêu cầu: id, createdAt, totalAmount, phone, items
 */
export const mapOrderToResponse = (order) => {
    return {
        id: order.id,
        createdAt: order.createdAt,
        totalAmount: Math.round(parseFloat(order.total)), // Convert to integer (VND)
        phone: order.user?.phone || order.phone || null, // Lấy từ user hoặc order
        items: order.details ? order.details.map(mapOrderDetailToCartItem) : []
    };
};

/**
 * Map multiple orders to response format
 */
export const mapOrdersToResponse = (orders) => {
    return orders.map(mapOrderToResponse);
};
