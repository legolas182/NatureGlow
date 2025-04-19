const orderService = require('../data/OrderService');
const { validationResult } = require('express-validator');

class OrderController {
    async createOrder(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const order = await orderService.createOrder(req.body, req.user.id);
            res.status(201).json({
                message: 'Orden creada exitosamente',
                order
            });
        } catch (error) {
            if (error.message.includes('Producto no encontrado') || 
                error.message.includes('Stock insuficiente')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error al crear la orden' });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            
            // Verificar si el usuario tiene acceso a esta orden
            if (order.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'No autorizado para ver esta orden' });
            }

            res.json(order);
        } catch (error) {
            if (error.message === 'Orden no encontrada') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error al obtener la orden' });
        }
    }

    async getUserOrders(req, res) {
        try {
            const orders = await orderService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las órdenes' });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const order = await orderService.updateOrderStatus(
                req.params.id,
                req.body.status,
                req.user.id
            );

            res.json({
                message: 'Estado de la orden actualizado exitosamente',
                order
            });
        } catch (error) {
            if (error.message === 'Orden no encontrada') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'No autorizado para modificar esta orden' ||
                error.message === 'Estado de orden inválido') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error al actualizar el estado de la orden' });
        }
    }

    async cancelOrder(req, res) {
        try {
            const result = await orderService.cancelOrder(req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            if (error.message === 'Orden no encontrada') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'No autorizado para cancelar esta orden' ||
                error.message === 'No se puede cancelar una orden completada') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error al cancelar la orden' });
        }
    }
}

module.exports = new OrderController(); 