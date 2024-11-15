import { Schema, model, Document } from 'mongoose';
import { iRole } from './roleModel';

export interface IUser extends Document {
    name: string;
    lastname: string;
    dateBirth: Date;
    phone: number;
    email: string;
    password: string;
    role: iRole['_id'];
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        dateBirth: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const userModel = model<IUser>('User', userSchema);

export default userModel;
