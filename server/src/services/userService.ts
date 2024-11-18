import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';

class userService {

    async createUser(userData: {
        name: string;
        lastname: string;
        dateBirth: Date;
        email: string;
        password: string;
        role: string;
        phone: number;
    }) {
        try {
            // Imprimir los datos antes de intentar crear el usuario
            console.log("Attempting to create user with data:", userData);

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Crear el nuevo usuario
            const newUser = new userModel({
                ...userData,
                password: hashedPassword,
            });

            // Guardar el usuario
            return await newUser.save();
        } catch (error) {
            // Imprimir el error completo para obtener más detalles
            console.error("Error while creating the user:", error);

            // Asegurarse de lanzar un error con más detalles
            throw new Error(`Error while creating the user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error('Error while getting users');
        }
    }

    async getUserById(id: string) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error while getting user by id');
        }
    }

    async updateUserById(id: string, userData: Partial<{
        name: string;
        lastname: string;
        dateBirth: Date;
        email: string;
        password: string;
        role: string;
        phone: number;
    }>) {
        try {
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        } catch (error) {
            throw new Error('Error while updating user');
        }
    }

    async deleteUserById(id: string) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new Error('User not found');
            }
            return deletedUser;
        } catch (error) {
            throw new Error('Error while deleting user by id');
        }
    }
}

export const UserService = new userService();
