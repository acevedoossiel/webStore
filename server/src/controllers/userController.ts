import { Request, Response } from "express";
import { UserService } from "../services/userService";

class userController {
    async createUser(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const newUser = await UserService.createUser(user);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating the user' });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error while getting users' });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error while getting user by id' });
        }
    }

    async updateUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userData = req.body;
            if (!userData || Object.keys(userData).length === 0) {
                return res.status(400).json({ message: 'No data provided for update' });
            }
            const updatedUser = await UserService.updateUserById(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'User updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while updating user` });
        }
    }


    async deleteUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletRole = await UserService.deleteUserById(id);
            if (!deletRole) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error while deleting user' });
        }
    }

}
export const UserController = new userController();
