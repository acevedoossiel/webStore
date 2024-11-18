import { Request, Response } from "express";
import { UserService } from "../services/userService";

class userController {
    async createUser(req: Request, res: Response) {
        try {
            const { name, lastname, dateBirth, phone, email, password, role } = req.body;
            console.log("sisisis" + password)
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }

            const newUser = await UserService.createUser({ name, lastname, dateBirth, phone, email, password, role });
            return res.status(201).json(newUser);
        } catch (error: unknown) {  // Se especifica 'unknown' explícitamente
            console.error('Error while creating user:', error);

            // Verifica si el error es una instancia de Error
            if (error instanceof Error) {
                return res.status(500).json({
                    message: `Error creating the user: ${error.message}`,  // Acceder a 'message' porque ya verificamos el tipo
                    error: error
                });
            }

            // Si el error no es una instancia de Error, responde con un error genérico
            return res.status(500).json({
                message: 'Unknown error occurred',
                error: error
            });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: `Error while getting users` });
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
            return res.status(500).json({ message: `Error while getting user by id` });
        }
    }

    async updateUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userData = req.body;

            if (!userData || Object.keys(userData).length === 0) {
                return res.status(400).json({ message: 'No data provided for update' });
            }

            if (userData.password) {
                if (userData.password.length < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters' });
                }
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
            const deletedUser = await UserService.deleteUserById(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: `Error while deleting user` });
        }
    }
}

export const UserController = new userController();
