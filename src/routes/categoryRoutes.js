const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const CategoryController = require('../controllers/CategoryController');
const { authenticateToken, isAdmin } = require('../middleware/AuthMiddleware');

// Validaciones
const categoryValidations = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('description').optional().isString().withMessage('La descripción debe ser texto')
];

// Rutas públicas
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

// Rutas de administrador
router.post('/', authenticateToken, isAdmin, categoryValidations, CategoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryValidations, CategoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, CategoryController.deleteCategory);
router.patch('/:id/toggle-status', authenticateToken, isAdmin, CategoryController.toggleCategoryStatus);

module.exports = router; 