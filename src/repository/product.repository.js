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
 * Search products with dynamic filters
 * @param {Object} filter - Object contains filtering parameters (search, priceMin, priceMax, etc.)
 */
export const searchWithFilter = async (filter) => {
    try {
        const conditions = [];

        if (filter.search && filter.search.trim() !== "") {
            conditions.push({
                OR: [
                    { name: { contains: filter.search.trim(), mode: "insensitive" } },
                ]
            });
        }

        if (filter.priceMin !== undefined || filter.priceMax !== undefined) {
            const priceCondition = {};

            if (filter.priceMin !== undefined) {
                priceCondition.gte = parseFloat(filter.priceMin);
            }
            if (filter.priceMax !== undefined) {
                priceCondition.lte = parseFloat(filter.priceMax);
            }

            conditions.push({ price: priceCondition });
        }

        const products = await prisma.product.findMany({
            where: conditions.length > 0 ? { AND: conditions } : {},
            take: 20, // Pagination with 20 objects at once
            orderBy: {
                name: "asc", // Might change to dynamic sort
            },
            // select: { ... } // Only take the required fields
        });

        return products;
    } catch (error) {
        // Log the error but do not expose the internal database structure
        console.error("Database search error:", error);
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
