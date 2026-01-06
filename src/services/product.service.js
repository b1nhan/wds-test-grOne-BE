import * as productRepository from "../repository/product.repository.js";

/**
 * Get products with pagination and filters
 * @param {Object} options - { keyword, minPrice, maxPrice, sort, limit, page }
 * @returns {Object} { items, totalItems, pagination }
 */
export const getProducts = async (options = {}) => {
    try {
        const {
            keyword,
            minPrice,
            maxPrice,
            sort = "newest",
            limit = 10,
            page = 1
        } = options;

        // Sanitize and validate inputs
        const filterOptions = {
            sort: ["price_asc", "price_desc", "newest"].includes(sort) ? sort : "newest",
            limit: Math.max(1, Math.min(100, parseInt(limit) || 10)), // Min 1, Max 100
            page: Math.max(1, parseInt(page) || 1),
        };

        if (keyword && typeof keyword === "string" && keyword.trim().length > 0) {
            filterOptions.keyword = keyword.trim().slice(0, 100);
        }

        if (minPrice !== undefined && !isNaN(Number(minPrice))) {
            filterOptions.minPrice = Number(minPrice);
        }

        if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
            filterOptions.maxPrice = Number(maxPrice);
        }

        // Get data from repository
        let result;
        if (filterOptions.keyword || filterOptions.minPrice !== undefined || filterOptions.maxPrice !== undefined) {
            result = await productRepository.searchWithFilter(filterOptions);
        } else {
            result = await productRepository.getAllWithPagination(filterOptions);
        }

        // Calculate pagination metadata
        const totalPages = Math.ceil(result.totalItems / filterOptions.limit);

        return {
            items: result.items,
            pagination: {
                page: filterOptions.page,
                limit: filterOptions.limit,
                totalItems: result.totalItems,
                totalPages,
            }
        };
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw new Error("Unable to retrieve products");
    }
};

/**
 * Get product by ID
 * @param {Number} id - Product ID
 * @returns {Object|null} Product object or null if not found
 */
export const getById = async (id) => {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error("Invalid product ID");
        }

        const product = await productRepository.getOne(Number(id));
        return product;
    } catch (error) {
        console.error("Failed to fetch product by ID:", error);
        throw new Error("Unable to retrieve product");
    }
};

/**
 * Create new product
 * @param {Object} data - Product data { name, price, stock, description, imageUrl }
 * @returns {Object} Created product
 */
export const create = async (data) => {
    try {
        // Validate required fields
        if (!data.name || !data.price || data.stock === undefined) {
            throw new Error("Name, price, and stock are required");
        }

        // Map stock to quantity (database field)
        const productData = {
            name: data.name.trim(),
            price: Number(data.price),
            quantity: Number(data.stock),
            description: data.description?.trim() || null,
            imageUrl: data.imageUrl?.trim() || null,
        };

        const product = await productRepository.create(productData);
        return product;
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }
};

/**
 * Update product by ID
 * @param {Number} id - Product ID
 * @param {Object} data - Product data to update
 * @returns {Object} Updated product
 */
export const update = async (id, data) => {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error("Invalid product ID");
        }

        // Check if product exists
        const existing = await productRepository.getOne(Number(id));
        if (!existing) {
            throw new Error("Product not found");
        }

        // Build update data (only include provided fields)
        const updateData = {};
        if (data.name !== undefined) updateData.name = data.name.trim();
        if (data.price !== undefined) updateData.price = Number(data.price);
        if (data.stock !== undefined) updateData.quantity = Number(data.stock); // Map stock to quantity
        if (data.description !== undefined) updateData.description = data.description?.trim() || null;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl?.trim() || null;

        const product = await productRepository.update(Number(id), updateData);
        return product;
    } catch (error) {
        console.error("Failed to update product:", error);
        throw error;
    }
};

/**
 * Delete product by ID
 * @param {Number} id - Product ID
 * @returns {Object} Deleted product
 */
export const remove = async (id) => {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error("Invalid product ID");
        }

        // Check if product exists
        const existing = await productRepository.getOne(Number(id));
        if (!existing) {
            throw new Error("Product not found");
        }

        await productRepository.remove(Number(id));
        return existing;
    } catch (error) {
        console.error("Failed to delete product:", error);
        throw error;
    }
};