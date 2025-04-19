const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

class DataUser {
    async createUser(userData) {
        const existingUser = await UserModel.findOne({ 
            where: { email: userData.email } 
        });
        
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        return await UserModel.create(userData);
    }

    async login(email, password) {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { user, token };
    }

    async getUserById(id) {
        const user = await UserModel.findByPk(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async updateUser(id, userData) {
        const user = await UserModel.findByPk(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return await user.update(userData);
    }

    async deleteUser(id) {
        const user = await UserModel.findByPk(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        await user.destroy();
        return { message: 'Usuario eliminado exitosamente' };
    }
}

module.exports = new DataUser(); 