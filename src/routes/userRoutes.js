const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const { authenticateToken, isAdmin } = require('../middleware/AuthMiddleware');

// Validaciones
const userValidations = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const adminUserValidations = [
    ...userValidations,
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Rol inválido')
];

// Rutas públicas
router.post('/register', userValidations, UserController.register);
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
], UserController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], UserController.updateProfile);

// Rutas de administrador
router.get('/users', authenticateToken, isAdmin, UserController.getAllUsers);
router.get('/users/:id', authenticateToken, isAdmin, UserController.getUserById);
router.post('/users', authenticateToken, isAdmin, adminUserValidations, UserController.createUser);
router.put('/users/:id', authenticateToken, isAdmin, adminUserValidations, UserController.updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, UserController.deleteUser);

module.exports = router; 