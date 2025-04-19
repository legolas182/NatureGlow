const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');

class DataProduct {
    async createProduct(productData, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden crear productos');
        }

        const category = await CategoryModel.findByPk(productData.categoryId);
        if (!category) {
            throw new Error('Categoría no encontrada');
        }
        return await ProductModel.create(productData);
    }

    async getAllProducts(filters = {}) {
        const query = {
            include: [{
                model: CategoryModel,
                attributes: ['id', 'name', 'type']
            }],
            where: { active: true } // Por defecto solo productos activos
        };

        if (filters.categoryId) {
            query.where = { ...query.where, categoryId: filters.categoryId };
        }

        // Solo admins pueden ver productos inactivos
        if (filters.userRole === 'admin' && filters.includeInactive) {
            delete query.where.active;
        }

        return await ProductModel.findAll(query);
    }

    async getProductById(id) {
        const product = await ProductModel.findByPk(id, {
            include: [{
                model: CategoryModel,
                attributes: ['id', 'name', 'type']
            }]
        });

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    }

    async updateProduct(id, productData, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden actualizar productos');
        }

        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (productData.categoryId) {
            const category = await CategoryModel.findByPk(productData.categoryId);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }
        }

        return await product.update(productData);
    }

    async deleteProduct(id, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden eliminar productos');
        }

        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // En lugar de eliminar, marcamos como inactivo
        await product.update({ active: false });
        return { message: 'Producto desactivado exitosamente' };
    }

    // Método interno usado por el sistema de órdenes
    async updateStock(id, quantity) {
        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (product.stock + quantity < 0) {
            throw new Error('Stock insuficiente');
        }

        return await product.update({
            stock: product.stock + quantity
        });
    }

    // Nuevos métodos para administración
    async updateStock(id, quantity, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden actualizar el stock');
        }

        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (product.stock + quantity < 0) {
            throw new Error('El stock no puede ser negativo');
        }

        return await product.update({
            stock: product.stock + quantity
        });
    }

    async toggleProductStatus(id, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden cambiar el estado del producto');
        }

        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        await product.update({ active: !product.active });
        return {
            message: `Producto ${product.active ? 'activado' : 'desactivado'} exitosamente`
        };
    }
}

module.exports = new DataProduct(); 