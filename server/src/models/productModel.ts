import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    brand: string;
    modelo: string;
    description: string;
    srcImage: boolean;
    price: number;
    capacity: number
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
            type: Boolean,
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
    },
    {
        timestamps: true,
    }
);


const productModel = model<IProduct>('Product', productSchema);

export default productModel;
