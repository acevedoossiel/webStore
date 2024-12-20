import { Request, Response } from "express";
import { UserService } from "../services/userService";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { config } from '../config';

class userController {

    async createUser(req: Request, res: Response) {
        try {
            const { name, lastname, dateBirth, phone, email, password, role } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }

            const newUser = await UserService.createUser({ name, lastname, dateBirth, phone, email, password, role });
            return res.status(201).json(newUser);
        } catch (error: unknown) {
            console.error('Error while creating user:', error);

            return res.status(500).json({
                message: `Error creating the user: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                error
            });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error while getting users:', error);
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
            console.error('Error while getting user by id:', error);
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

            if (userData.password && userData.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
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
            console.error('Error while updating user:', error);
            return res.status(500).json({ message: 'Error while updating user' });
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
            console.error('Error while deleting user:', error);
            return res.status(500).json({ message: 'Error while deleting user' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }
    
            const token = jwt.sign(
                { id: user.id, email: user.email },
                config.jwtSecret,
                { expiresIn: '1h' }
            );
    
            console.log('Token generado:', token);
    
            return res.json({ token });
        } catch (error) {
            console.error('Error en el servidor:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async validateToken(req: Request, res: Response) {
        const authToken = req.body.authToken; // Obtener el token del cuerpo de la solicitud
    
        if (!authToken) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }
    
        try {
            const decoded = jwt.verify(authToken, config.jwtSecret) as jwt.JwtPayload;
            return res.status(200).json({ message: "Token válido", userId: decoded.id });
        } catch (err) {
            console.error('Error al validar el token:', err);
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
    }
    
}

export const UserController = new userController();
