import { Request, Response } from "express";
import { ProductService } from "../services/productService";

class productController {
    async createProduct(req: Request, res: Response) {
        try {
            const { brand, modelo, description, srcImage, price, capacity } = req.body;
            const newProduct = await ProductService.createProduct({
                brand,
                modelo,
                description,
                srcImage,
                price,
                capacity,
            });
            return res.status(201).json(newProduct);
        } catch (error: unknown) {
            console.error('Error while creating product:', error);
            if (error instanceof Error) {
                if (error.message.includes('A product with the same brand and model already exists')) {
                    return res.status(400).json({
                        message: error.message,
                    });
                }
                return res.status(500).json({
                    message: `Error creating the product: ${error.message}`,
                });
            }
            return res.status(500).json({
                message: 'Unknown error occurred',
                error: error,
            });
        }
    }


    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await ProductService.getAllProducts();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: `Error while getting products` });
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: `Error while getting product by id` });
        }
    }

    async updateProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productData = req.body;
            if (!productData || Object.keys(productData).length === 0) {
                return res.status(400).json({ message: 'No data provided for update' });
            }
            const updatedProduct = await ProductService.updateProductById(id, productData);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({
                message: 'Product updated successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while updating product` });
        }
    }

    async deleteProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedProduct = await ProductService.deleteProductById(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: `Error while deleting product` });
        }
    }
}

export const ProductController = new productController();
