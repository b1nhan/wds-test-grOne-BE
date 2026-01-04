import * as productService from "../services/product.service.js";

export const searchProducts = async (req, res) => {
    try {
        const { search, priceMin, priceMax } = req.query;
        let products;

        const filter = {};
        if (search) {
            filter.search = search;
        }

        if (priceMin !== undefined) {
            filter.priceMin = parseFloat(priceMin);
        }

        if (priceMax !== undefined) {
            filter.priceMax = parseFloat(priceMax);
        }
        
        if (filter.search || filter.priceMin !== undefined || filter.priceMax !== undefined) {
            products = await productService.searchWithFilter(filter);
        } else {
            products = await productService.getAll();
        }

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}