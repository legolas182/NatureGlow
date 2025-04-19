const { validationResult } = require('express-validator');
const { ProductModel } = require('../models');

class ProductController {
    // Obtener todos los productos
    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
        }
    }

    // Obtener un producto por ID
    static async getProductById(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
        }
    }

    // Crear un nuevo producto
    static async createProduct(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const product = await ProductModel.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el producto', error: error.message });
        }
    }

    // Actualizar un producto
    static async updateProduct(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            await product.update(req.body);
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
        }
    }

    // Eliminar un producto
    static async deleteProduct(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            await product.destroy();
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
        }
    }

    // Actualizar stock de un producto
    static async updateStock(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const newStock = product.stock + parseInt(req.body.quantity);
            if (newStock < 0) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }

            await product.update({ stock: newStock });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el stock', error: error.message });
        }
    }

    // Cambiar estado del producto (activo/inactivo)
    static async toggleProductStatus(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            await product.update({ isActive: !product.isActive });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar el estado del producto', error: error.message });
        }
    }
}

module.exports = ProductController; 