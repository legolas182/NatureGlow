const express = require('express');
const router = express.Router();

// TODO: Implementar controlador de productos
// const productController = require('../controllers/product.controller');

// Rutas temporales
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de productos' });
});

module.exports = router; 