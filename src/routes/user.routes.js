const express = require('express');
const router = express.Router();

// TODO: Implementar controlador de usuarios
// const userController = require('../controllers/user.controller');

// Rutas temporales
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de usuarios' });
});

module.exports = router; 