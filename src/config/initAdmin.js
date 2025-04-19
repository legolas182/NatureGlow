const { UserModel } = require('../models');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
    try {
        // Verificar si ya existe un admin
        const adminExists = await UserModel.findOne({
            where: { email: process.env.ADMIN_EMAIL || 'admin@naturegrow.com' }
        });

        if (!adminExists) {
            // Crear admin por defecto
            await UserModel.create({
                name: 'Administrador',
                email: process.env.ADMIN_EMAIL || 'admin@naturegrow.com',
                password: process.env.ADMIN_PASSWORD || 'admin123456',
                role: 'admin',
                isActive: true
            });
            console.log('Administrador por defecto creado exitosamente');
        }
    } catch (error) {
        console.error('Error al crear el administrador por defecto:', error);
    }
};

module.exports = createDefaultAdmin; 