import * as productRepository from "../repository/product.repository.js";

export const getAll = async () => {
    try {
        const products = await productRepository.getAll();

        if (Array.isArray(products)) {
            return products
                // .filter(product => product.isActive !== false)
                .sort((a, b) => a.name.localeCompare(b.name));
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch all products:", error);
        throw new Error("Unable to retrieve all products");
    }
};

export const searchWithFilter = async (filter) => {
    // Filter: { search, priceMin, priceMax }
    if (!filter || typeof filter !== "object") {
        return [];
    }

    // Sanitize and validate inputs inside filter
    const filterObject = {};

    if (filter.search && typeof filter.search === "string" && filter.search.trim().length > 0) {
        filterObject.search = filter.search.trim().slice(0, 100);
    }

    if (
        filter.priceMin !== undefined &&
        (typeof filter.priceMin === "number" || !isNaN(Number(filter.priceMin)))
    ) {
        filterObject.priceMin = Number(filter.priceMin);
    }

    if (
        filter.priceMax !== undefined &&
        (typeof filter.priceMax === "number" || !isNaN(Number(filter.priceMax)))
    ) {
        filterObject.priceMax = Number(filter.priceMax);
    }

    try {
        const products = await productRepository.searchWithFilter(filterObject);
        return products;
    } catch (error) {
        console.error(error);
        throw new Error(
            `Unable to retrieve products with filter: ${JSON.stringify(filterObject)}`
        );
    }
}