const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const { authenticateToken, isAdmin } = require('../middleware/AuthMiddleware');

// Validaciones
const productValidations = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('categoryId').isInt().withMessage('Categoría inválida')
];

// Rutas públicas
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rutas de administrador
router.post('/', authenticateToken, isAdmin, productValidations, ProductController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productValidations, ProductController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, ProductController.deleteProduct);
router.patch('/:id/stock', authenticateToken, isAdmin, [
    body('quantity').isInt().withMessage('La cantidad debe ser un número entero')
], ProductController.updateStock);
router.patch('/:id/toggle-status', authenticateToken, isAdmin, ProductController.toggleProductStatus);

module.exports = router; 