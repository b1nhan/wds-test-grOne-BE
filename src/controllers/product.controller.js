import * as productService from "../services/product.service.js";
import { mapProductToResponse, mapProductsToResponse } from "../utils/product.mapper.js";

/**
 * GET /products
 * Lấy danh sách sản phẩm với filter, pagination và sort
 */
export const getProducts = async (c) => {
    try {
        console.log("getProducts controller called");
        const keyword = c.req.query("keyword");
        const minPrice = c.req.query("minPrice");
        const maxPrice = c.req.query("maxPrice");
        const sort = c.req.query("sort") || "newest";
        const limit = c.req.query("limit") || "10";
        const page = c.req.query("page") || "1";

        const options = {
            keyword,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            sort, // price_desc || price_asc
            limit: parseInt(limit),
            page: parseInt(page),
        };

        console.log("Calling productService.getProducts with options:", options);
        const result = await productService.getProducts(options);
        console.log("Service returned:", result);

        return c.json({
            success: true,
            message: "Lấy danh sách sản phẩm thành công",
            data: {
                items: mapProductsToResponse(result.items),
                pagination: result.pagination,
            }
        }, 200);
    } catch (error) {
        console.error("Error in getProducts:", error);
        console.error("Error stack:", error.stack);
        return c.json({ 
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách sản phẩm",
            statusCode: 500
        }, 500);
    }
};

/**
 * GET /products/:id
 * Lấy chi tiết một sản phẩm theo ID
 */
export const getProductById = async (c) => {
    try {
        const id = c.req.param("id");
        
        // Validate ID
        if (!id || isNaN(Number(id))) {
            return c.json({
                success: false,
                message: "ID sản phẩm không hợp lệ",
                statusCode: 400
            }, 400);
        }

        const product = await productService.getById(Number(id));

        if (!product) {
            return c.json({
                success: false,
                message: "Không tìm thấy sản phẩm",
                statusCode: 404
            }, 404);
        }

        return c.json({
            success: true,
            message: "Lấy thông tin sản phẩm thành công",
            data: mapProductToResponse(product)
        }, 200);
    } catch (error) {
        console.error("Error in getProductById:", error);
        return c.json({ 
            success: false,
            message: "Có lỗi xảy ra khi lấy thông tin sản phẩm",
            statusCode: 500
        }, 500);
    }
};

/**
 * POST /products
 * Tạo sản phẩm mới (Admin only)
 */
export const createProduct = async (c) => {
    try {
        const body = await c.req.json();

        // Validate required fields
        if (!body.name || body.price === undefined || body.stock === undefined) {
            return c.json({
                success: false,
                message: "Tên, giá và số lượng tồn kho là bắt buộc",
                statusCode: 400
            }, 400);
        }

        const product = await productService.create(body);

        return c.json({
            success: true,
            message: "Tạo sản phẩm thành công",
            data: mapProductToResponse(product)
        }, 201);
    } catch (error) {
        console.error("Error in createProduct:", error);
        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi tạo sản phẩm",
            statusCode: 500
        }, 500);
    }
};

/**
 * PUT /products/:id
 * Cập nhật sản phẩm (Admin only)
 */
export const updateProduct = async (c) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();

        // Validate ID
        if (!id || isNaN(Number(id))) {
            return c.json({
                success: false,
                message: "ID sản phẩm không hợp lệ",
                statusCode: 400
            }, 400);
        }

        const product = await productService.update(Number(id), body);

        return c.json({
            success: true,
            message: "Cập nhật sản phẩm thành công",
            data: mapProductToResponse(product)
        }, 200);
    } catch (error) {
        console.error("Error in updateProduct:", error);
        
        if (error.message === "Product not found") {
            return c.json({
                success: false,
                message: "Không tìm thấy sản phẩm",
                statusCode: 404
            }, 404);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi cập nhật sản phẩm",
            statusCode: 500
        }, 500);
    }
};

/**
 * DELETE /products/:id
 * Xóa sản phẩm (Admin only)
 */
export const deleteProduct = async (c) => {
    try {
        const id = c.req.param("id");

        // Validate ID
        if (!id || isNaN(Number(id))) {
            return c.json({
                success: false,
                message: "ID sản phẩm không hợp lệ",
                statusCode: 400
            }, 400);
        }

        await productService.remove(Number(id));

        return c.json({
            success: true,
            message: "Xóa sản phẩm thành công"
        }, 200);
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        
        if (error.message === "Product not found") {
            return c.json({
                success: false,
                message: "Không tìm thấy sản phẩm",
                statusCode: 404
            }, 404);
        }

        return c.json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi xóa sản phẩm",
            statusCode: 500
        }, 500);
    }
};