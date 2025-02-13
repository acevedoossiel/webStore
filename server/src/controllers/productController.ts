import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import fs from 'fs';
import path from 'path';
class productController {
    async createProduct(req: Request, res: Response) {
        try {
            const { brand, modelo, description, srcImage, price, capacity, flavors } = req.body;
            const newProduct = await ProductService.createProduct({
                brand,
                modelo,
                description,
                srcImage: srcImage || [],
                price,
                capacity,
                flavors,
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

            if (productData.srcImage && (!Array.isArray(productData.srcImage) || productData.srcImage.length === 0)) {
                return res.status(400).json({ message: 'At least one image is required' });
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

    async addImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            console.log('Product ID:', id);
            console.log('File:', req.file);

            if (!req.file) {
                console.error('No se ha proporcionado una imagen');
                return res.status(400).json({ message: 'No se ha proporcionado una imagen' });
            }

            const filename = req.file.filename;
            console.log('Filename:', filename);

            const imageUrl = `/uploads/images/${filename}`;

            console.log('Image URL:', imageUrl);

            if (!imageUrl) {
                return res.status(400).json({ message: 'Image URL or file is required' });
            }

            // Asegurémonos de que la URL no tenga duplicados antes de guardarla
            const cleanedImageUrl = imageUrl.replace(/\/uploads\/images\/uploads\/images\//, "/uploads/images/");

            const updatedProduct = await ProductService.addImageToProduct(id, cleanedImageUrl);
            console.log('Updated Product:', updatedProduct);

            return res.status(200).json({
                message: 'Imagen agregada correctamente',
                data: updatedProduct,
            });
        } catch (error) {
            console.error('Error while adding image:', error);
            return res.status(500).json({ message: `Error while adding image to product` });
        }
    }


    async removeImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({ message: 'Image URL is required' });
            }

            // Primero, eliminar la URL de la imagen del producto en la base de datos
            const updatedProduct = await ProductService.removeImageFromProduct(id, imageUrl);

            if (!updatedProduct) {
                throw new Error('Product not found');
            }

            // Luego, eliminar el archivo de imagen físicamente del servidor
            const filePath = path.resolve(`.${imageUrl}`);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen del servidor:', err);
                    return res.status(500).json({ message: 'Error al eliminar la imagen del servidor', err });
                }

                return res.status(200).json({
                    message: 'Imagen eliminada correctamente',
                    data: updatedProduct,
                });
            });
        } catch (error) {
            console.error('Error al eliminar la imagen del producto:', error);
            return res.status(500).json({ message: `Error while removing image from product` });
        }
    }

    async replaceImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { oldImageUrl } = req.body;

            if (!oldImageUrl) {
                return res.status(400).json({ message: 'Old image URL is required' });
            }

            // Determina la nueva URL de la imagen
            const newImageUrl = req.file
                ? `/uploads/images/${req.file.filename}` // Si se subió un archivo
                : req.body.newImageUrl; // Si se proporcionó una URL en el cuerpo

            if (!newImageUrl) {
                return res.status(400).json({ message: 'New image URL is required' });
            }

            // Llama al servicio para reemplazar la imagen
            const updatedProduct = await ProductService.replaceImageInProduct(id, oldImageUrl, newImageUrl);

            return res.status(200).json({
                message: 'Image replaced successfully',
                data: updatedProduct,
            });
        } catch (error) {
            console.error('Error while replacing image:', error);
            return res.status(500).json({ message: `Error while replacing image in product` });
        }
    }



    async addFlavor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { flavor } = req.body;
            if (!flavor) {
                return res.status(400).json({ message: 'Flavor is required' });
            }
            const updatedProduct = await ProductService.addFlavorToProduct(id, flavor);
            return res.status(200).json({
                message: 'Flavor added successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while adding flavor to product` });
        }
    }

    async removeFlavor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { flavor } = req.body;
            if (!flavor) {
                return res.status(400).json({ message: 'Flavor is required' });
            }
            const updatedProduct = await ProductService.removeFlavorFromProduct(id, flavor);
            return res.status(200).json({
                message: 'Flavor removed successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while removing flavor from product` });
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
