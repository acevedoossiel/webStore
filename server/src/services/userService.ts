import userModel from "../models/userModel";

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
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error while creating the userx`);
        }
    }


    async getAllUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error('Error while getting user');
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
            const updateUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
            if (!updateUser) {
                throw new Error('User not found');
            }
            return updateUser;
        } catch (error) {
            throw new Error(`Error while updating user`);
        }
    }
    

    async deleteUserById(id: string) {
        try {
            const deleteUser = await userModel.findByIdAndDelete(id);
            if (!deleteUser) {
                throw new Error('User not found');
            }
            return deleteUser;
        } catch (error) {
            throw new Error('Error while deleting user by id');
        }
    }

}
export const UserService = new userService();
