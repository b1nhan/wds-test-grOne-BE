/**
 * Map product from database format to API response format
 * Converts quantity -> stock
 */
export const mapProductToResponse = (product) => {
    if (!product) return null;

    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.quantity, // Map quantity to stock
        createdAt: product.createdAt,
        updatedAt: product.updatedAt || product.createdAt,
    };
};

/**
 * Map array of products
 */
export const mapProductsToResponse = (products) => {
    if (!Array.isArray(products)) return [];
    return products.map(mapProductToResponse);
};

