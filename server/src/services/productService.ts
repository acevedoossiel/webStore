import productModel from "../models/productModel";
import fs from 'fs';
import path from 'path';

class productService {

    async createProduct(productData: {
        brand: string;
        modelo: string;
        description: string;
        srcImage?: string[]; // Ahora es opcional
        price: number;
        capacity: number;
        flavors?: string[];
    }) {
        try {
            const existingProduct = await productModel.findOne({
                brand: productData.brand,
                modelo: productData.modelo,
            });

            if (existingProduct) {
                throw new Error('A product with the same brand and model already exists');
            }

            const newProduct = new productModel({
                ...productData,
                srcImage: productData.srcImage || [], // Default a un array vacío si no se especifica
            });
            return await newProduct.save();
        } catch (error) {
            throw new Error(`Error while creating the product: ${error}`);
        }
    }



    async getAllProducts() {
        try {
            return await productModel.find();
        } catch (error) {
            throw new Error('Error while getting products');
        }
    }

    async getProductById(id: any) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error while getting product by id');
        }
    }

    async updateProductById(id: string, productData: Partial<{
        brand: string;
        modelo: string;
        description: string;
        srcImage: string[];
        price: number;
        capacity: number;
        flavors?: string[];
    }>) {
        try {
            // if (productData.srcImage && productData.srcImage.length === 0) {
            //     throw new Error('At least one image is required for the product');
            // }

            const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error while updating product');
        }
    }

    // async addImageToProduct(productId: string, file: Express.Multer.File) {
    //     try {
    //         // Generar la URL basada en la ubicación del archivo
    //         const imageUrl = `/uploads/images/${file.filename}`;

    //         // Agregar la URL a la base de datos
    //         const updatedProduct = await productModel.findByIdAndUpdate(
    //             productId,
    //             { $addToSet: { srcImage: imageUrl } },
    //             { new: true }
    //         );

    //         if (!updatedProduct) {
    //             throw new Error('Product not found');
    //         }

    //         return updatedProduct;
    //     } catch (error) {
    //         throw new Error(`Error while adding image to product`);
    //     }
    // }

    async addImageToProduct(productId: string, imageUrl: string) {
        try {
            if (!imageUrl) {
                throw new Error("❌ Error: La URL de la imagen es undefined.");
            }

            // Agregar la URL de la imagen al array `srcImage` en MongoDB
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $addToSet: { srcImage: imageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error("❌ Error: Producto no encontrado.");
            }

            return updatedProduct;
        } catch (error) {
            throw new Error("❌ Error while adding image to product");
        }
    }



    async removeImageFromProduct(productId: string, imageUrl: string) {
        try {
            // Eliminar la referencia en la base de datos
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $pull: { srcImage: imageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error('Product not found');
            }

            // Eliminar el archivo físico
            const filePath = path.resolve('uploads/images', path.basename(imageUrl));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Borra el archivo del servidor
            }

            return updatedProduct;
        } catch (error) {
            throw new Error(`Error while removing image from product: ${error}`);
        }
    }

    async replaceImageInProduct(productId: string, oldImageUrl: string, file: Express.Multer.File) {
        try {
            // Generar la URL basada en la ubicación del archivo
            const newImageUrl = `/uploads/images/${file.filename}`;

            // Paso 1: Eliminar la imagen antigua de la base de datos
            const product = await productModel.findByIdAndUpdate(
                productId,
                { $pull: { srcImage: oldImageUrl } },
                { new: true }
            );

            if (!product) {
                throw new Error('Product not found');
            }

            // Paso 2: Agregar la nueva imagen a la base de datos
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $addToSet: { srcImage: newImageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error('Failed to add the new image');
            }

            // Eliminar físicamente la imagen antigua del servidor
            const filePath = path.resolve('uploads/images', path.basename(oldImageUrl));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Borra el archivo del servidor
            } else {
                console.log(`Archivo no encontrado para eliminar: ${filePath}`);
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error while replacing image in product:', error);
            throw new Error(`Error while replacing image in product`);
        }
    }





    async addFlavorToProduct(productId: string, flavor: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $addToSet: { flavors: flavor } },
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error while adding flavor to product`);
        }
    }

    async removeFlavorFromProduct(productId: string, flavor: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $pull: { flavors: flavor } },
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error while removing flavor from product`);
        }
    }

    async deleteProductById(id: string) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            return deletedProduct;
        } catch (error) {
            throw new Error('Error while deleting product by id');
        }
    }
}

export const ProductService = new productService();
