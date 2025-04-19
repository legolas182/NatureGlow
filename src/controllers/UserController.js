const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

class UserController {
    // Registro de usuario
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email } = req.body;
            const existingUser = await UserModel.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            }

            const user = await UserModel.create(req.body);
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
        }
    }

    // Login de usuario
    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const user = await UserModel.findOne({ where: { email } });
            
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            if (!user.isActive) {
                return res.status(401).json({ message: 'Usuario desactivado' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el login', error: error.message });
        }
    }

    // Obtener perfil del usuario
    static async getProfile(req, res) {
        try {
            const user = await UserModel.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
        }
    }

    // Actualizar perfil del usuario
    static async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await UserModel.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.update(req.body);
            res.json({
                message: 'Perfil actualizado exitosamente',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
        }
    }

    // Obtener todos los usuarios (solo admin)
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll({
                attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt']
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
        }
    }

    // Obtener un usuario por ID (solo admin)
    static async getUserById(req, res) {
        try {
            const user = await UserModel.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
        }
    }

    // Actualizar usuario por ID (solo admin)
    static async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await UserModel.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.update(req.body);
            res.json({
                message: 'Usuario actualizado exitosamente',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
        }
    }

    // Eliminar usuario (solo admin)
    static async deleteUser(req, res) {
        try {
            const user = await UserModel.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.destroy();
            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
        }
    }
}

module.exports = UserController; 