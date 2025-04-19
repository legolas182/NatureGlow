const { validationResult } = require('express-validator');
const { CategoryModel, ProductModel } = require('../models');

class CategoryController {
    // Obtener todas las categorías
    static async getAllCategories(req, res) {
        try {
            const categories = await CategoryModel.findAll({
                include: [{
                    model: ProductModel,
                    as: 'products',
                    attributes: ['id', 'name']
                }]
            });
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
        }
    }

    // Obtener una categoría por ID
    static async getCategoryById(req, res) {
        try {
            const category = await CategoryModel.findByPk(req.params.id, {
                include: [{
                    model: ProductModel,
                    as: 'products'
                }]
            });
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
        }
    }

    // Crear una nueva categoría
    static async createCategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const category = await CategoryModel.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear categoría', error: error.message });
        }
    }

    // Actualizar una categoría
    static async updateCategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const category = await CategoryModel.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            await category.update(req.body);
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
        }
    }

    // Eliminar una categoría
    static async deleteCategory(req, res) {
        try {
            const category = await CategoryModel.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            // Verificar si hay productos asociados
            const productsCount = await ProductModel.count({
                where: { categoryId: req.params.id }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    message: 'No se puede eliminar la categoría porque tiene productos asociados'
                });
            }

            await category.destroy();
            res.json({ message: 'Categoría eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
        }
    }

    // Cambiar estado de la categoría
    static async toggleCategoryStatus(req, res) {
        try {
            const category = await CategoryModel.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            await category.update({ isActive: !category.isActive });
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar estado de la categoría', error: error.message });
        }
    }
}

module.exports = CategoryController; 