import { prisma } from "../config/prisma.js";

export const getAll = async () => {
    return await prisma.product.findMany({
        where: { 
            status: 1 // Only active products (status = 1 means visible)
        }
    });
};

/**
 * Find one product with the required `id` (only active products)
 * @param {Number} id
 */
export const getOne = async (id) => {
    return await prisma.product.findFirst({
        where: { 
            id: Number(id),
            status: 1 // Only active products (status = 1 means visible)
        },
    });
};

/**
 * Find one product by ID (including hidden/deleted products - for admin use)
 * @param {Number} id
 * @returns {Object|null} Product or null if not found
 */
export const getOneById = async (id) => {
    return await prisma.product.findUnique({
        where: { 
            id: Number(id)
        },
    });
};

/**
 * Search products with dynamic filters, pagination and sorting
 * @param {Object} options - { keyword, minPrice, maxPrice, sort, limit, page }
 * @returns {Object} { items, totalItems }
 */
export const searchWithFilter = async (options = {}) => {
    try {
        const {
            keyword,
            minPrice,
            maxPrice,
            sort = "newest",
            limit = 10,
            page = 1
        } = options;

        const conditions = [
            { status: 1 } // Only active products (status = 1 means visible)
        ];

        // Search by keyword (MySQL doesn't support case-insensitive mode, use contains)
        if (keyword && keyword.trim() !== "") {
            conditions.push({
                OR: [
                    { name: { contains: keyword.trim() } },
                ]
            });
        }

        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceCondition = {};

            if (minPrice !== undefined) {
                priceCondition.gte = parseFloat(minPrice);
            }
            if (maxPrice !== undefined) {
                priceCondition.lte = parseFloat(maxPrice);
            }

            conditions.push({ price: priceCondition });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build orderBy based on sort parameter
        let orderBy = {};
        switch (sort) {
            case "price_asc":
                orderBy = { price: "asc" };
                break;
            case "price_desc":
                orderBy = { price: "desc" };
                break;
            case "newest":
            default:
                orderBy = { createdAt: "desc" };
                break;
        }

        // Get total count for pagination
        const totalItems = await prisma.product.count({
            where: { AND: conditions },
        });

        // Get products with pagination
        const items = await prisma.product.findMany({
            where: { AND: conditions },
            skip,
            take,
            orderBy,
        });

        return {
            items,
            totalItems,
        };
    } catch (error) {
        console.error("Database search error:", error);
        throw new Error("Internal Server Error");
    }
}

/**
 * Get all products with pagination and sorting
 * @param {Object} options - { sort, limit, page }
 * @returns {Object} { items, totalItems }
 */
export const getAllWithPagination = async (options = {}) => {
    try {
        const {
            sort = "newest",
            limit = 10,
            page = 1
        } = options;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build orderBy
        let orderBy = {};
        switch (sort) {
            case "price_asc":
                orderBy = { price: "asc" };
                break;
            case "price_desc":
                orderBy = { price: "desc" };
                break;
            case "newest":
            default:
                orderBy = { createdAt: "desc" };
                break;
        }

        const totalItems = await prisma.product.count({
            where: { 
                status: 1 // Only active products (status = 1 means visible)
            }
        });
        const items = await prisma.product.findMany({
            where: { 
                status: 1 // Only active products (status = 1 means visible)
            },
            skip,
            take,
            orderBy,
        });

        return {
            items,
            totalItems,
        };
    } catch (error) {
        console.error("Database get all error:", error);
        throw new Error("Internal Server Error");
    }
}

export const create = async (data) => {
    return await prisma.product.create({
        data,
    });
};

export const update = async (id, data) => {
    return await prisma.product.update({
        where: { id: Number(id) },
        data,
    });
};

export const remove = async (id) => {
    // Soft delete: set status to 0 (ẩn) instead of hard delete
    return await prisma.product.update({
        where: { id: Number(id) },
        data: { status: 0 }, // Hide product (status = 0 means inactive/hidden)
    });
};

/**
 * Find multiple products by IDs (for transaction use)
 * @param {Array} productIds - Array of product IDs
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Array} Products array
 */
export const findManyByIds = async (productIds, tx = null) => {
    const client = tx || prisma;
    return await client.product.findMany({
        where: {
            id: { in: productIds.map(id => Number(id)) },
            status: 1 // Only active products (status = 1 means visible)
        }
    });
};

/**
 * Update product quantity (for transaction use)
 * @param {Number} productId - Product ID
 * @param {Number} quantity - Quantity to decrement
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Object} Updated product
 */
export const updateQuantity = async (productId, quantity, tx = null) => {
    const client = tx || prisma;
    return await client.product.update({
        where: { id: Number(productId) },
        data: {
            quantity: {
                decrement: Number(quantity)
            }
        }
    });
};
