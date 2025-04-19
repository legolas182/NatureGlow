const productRepository = require('../repositories/product.repository');

class ProductService {
    async getAllProducts() {
        return await productRepository.findAll();
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async createProduct(productData) {
        // Validaciones de negocio
        if (!productData.name || !productData.price) {
            throw new Error('Nombre y precio son requeridos');
        }

        if (productData.price <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        return await productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        const product = await productRepository.update(id, productData);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async deleteProduct(id) {
        const deleted = await productRepository.delete(id);
        if (!deleted) {
            throw new Error('Producto no encontrado');
        }
        return true;
    }

    async getProductsByCategory(category) {
        return await productRepository.findByCategory(category);
    }

    async getProductsInStock() {
        return await productRepository.findInStock();
    }
}

module.exports = new ProductService(); 