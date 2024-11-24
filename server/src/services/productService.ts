import productModel from "../models/productModel";

class productService {

    async createProduct(productData: {
        brand: string;
        modelo: string;
        description: string;
        srcImage: boolean;
        price: number;
        capacity: number;
    }) {
        try {
            const existingProduct = await productModel.findOne({
                brand: productData.brand,
                modelo: productData.modelo,
            });

            if (existingProduct) {
                throw new Error('A product with the same brand and model already exists');
            }
            const newProduct = new productModel(productData);
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
        srcImage: boolean;
        price: number;
        capacity: number;
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
