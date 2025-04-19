const express = require('express');
const router = express.Router();

// TODO: Implementar controlador de órdenes
// const orderController = require('../controllers/order.controller');

// Rutas temporales
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de órdenes' });
});

module.exports = router; 