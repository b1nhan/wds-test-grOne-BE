import * as productService from "../services/product.service.js";

export const searchProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let products;

        if (search) {
            products = await productService.search(search);
            // } else if (category) {
            //     products = await productService.getByCategory(category);
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