import { prisma } from "../config/prisma.js";

export const getAll = async () => {
    return await prisma.product.findMany();
};

/**
 * Find one product with the required `id`
 * @param {Number} id
 */
export const getOne = async (id) => {
    return await prisma.product.findUnique({
        where: { id: Number(id) },
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

        const conditions = [];

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
            where: conditions.length > 0 ? { AND: conditions } : {},
        });

        // Get products with pagination
        const items = await prisma.product.findMany({
            where: conditions.length > 0 ? { AND: conditions } : {},
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

        const totalItems = await prisma.product.count();
        const items = await prisma.product.findMany({
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
    return await prisma.product.delete({
        where: { id: Number(id) },
    });
};
