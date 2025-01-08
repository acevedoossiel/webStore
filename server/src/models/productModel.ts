import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    brand: string;
    modelo: string;
    description: string;
    srcImage: string[];
    price: number;
    capacity: number
    flavors: string[];
}

const productSchema = new Schema<IProduct>(
    {
        brand: {
            type: String,
            required: true,
            trim: true
        },
        modelo: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        srcImage: {
            type: [String],
            required: false,
            default: [],
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        capacity: {
            type: Number,
            required: true,
            trim: true,
        },
        flavors: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);


const productModel = model<IProduct>('Product', productSchema);

export default productModel;
