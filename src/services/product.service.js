import * as productRepository from "../services/product.repository.js";

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

export const search = async (q) => {
    // Input validation
    if (!q || typeof q !== "string" || q.trim().length === 0) {
        return [];
    }

    // Limit the length of the search string to prevent resource exhaustion
    const searchTerm = q.trim().slice(0, 100);
    
    try {
        const products = await productRepository.search(searchTerm);
        return products;
    } catch (error) {
        console.log(error);
        throw new Error(`Unable to retrieve products with keyword ${searchTerm}`);
    }
}