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
        featured?: boolean;
    }) {
        try {
            const existingProduct = await productModel.findOne({
                brand: productData.brand,
                modelo: productData.modelo,
                capacity: productData.capacity
            });

            if (existingProduct) {
                throw new Error('A product with the same brand and model and capacity already exists');
            }

            const newProduct = new productModel({
                ...productData,
                srcImage: productData.srcImage || [],
                featured: productData.featured || false,
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
        featured?: boolean;
    }>) {
        try {

            const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error while updating product');
        }
    }


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

    async getLatestProducts() {
        try {
            // Realizamos la consulta para obtener los tres productos más recientes
            const latestProducts = await productModel.find().sort({ createdAt: -1 }).limit(8);
            return latestProducts;
        } catch (error) {
            console.error("Error while getting latest products from DB:", error);
            throw new Error("Error fetching latest products");
        }
    }

    async getProductsWithPromotions() {
        try {
            return await productModel.find({ hasPromotion: true });
        } catch (error) {
            throw new Error("Error while getting products with promotions");
        }
    }

    async getProductsWithoutPromotions() {
        try {
            return await productModel.find({ hasPromotion: false });
        } catch (error) {
            throw new Error("Error while getting products without promotions");
        }
    }

    async addPromotion(productId: string, quantity: number, price: number) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Verificar si ya existe una promoción con la misma cantidad
            const existingPromo = product.promotions.find(promo => promo.quantity === quantity);
            if (existingPromo) {
                throw new Error("A promotion with this quantity already exists");
            }

            // Agregar nueva promoción
            product.promotions.push({ quantity, price });
            product.hasPromotion = true;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while adding promotion");
        }
    }

    async updatePromotions(productId: string, promotions: { quantity: number; price: number }[]) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Reemplazar todas las promociones
            product.promotions = promotions;
            product.hasPromotion = promotions.length > 0;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while updating promotions");
        }
    }

    async removePromotion(productId: string, quantity: number) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Filtrar para eliminar la promoción específica
            product.promotions = product.promotions.filter(promo => promo.quantity !== quantity);
            product.hasPromotion = product.promotions.length > 0;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while removing promotion");
        }
    }

    async clearPromotions(productId: string) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Limpiar todas las promociones
            product.promotions = [];
            product.hasPromotion = false;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while clearing promotions");
        }
    }

    async getFeaturedProducts() {
        try {
            return await productModel.find({ featured: true });
        } catch (error) {
            throw new Error("Error while getting featured products");
        }
    }


}

export const ProductService = new productService();
