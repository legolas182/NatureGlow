const { Product } = require('../models');

class ProductController {
    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos', error });
        }
    }

    // Obtener un producto por ID
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto', error });
        }
    }

    // Crear un nuevo producto
    async createProduct(req, res) {
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el producto', error });
        }
    }

    // Actualizar un producto
    async updateProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await product.update(req.body);
            res.json(product);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el producto', error });
        }
    }

    // Eliminar un producto
    async deleteProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await product.destroy();
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto', error });
        }
    }
}

module.exports = new ProductController(); 