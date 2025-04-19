const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const ProductModel = require('../models/ProductModel');
const UserModel = require('../models/UserModel');
const dataProduct = require('./dataProduct');
const sequelize = require('../config/database');

class DataOrder {
    async createOrder(orderData, userId) {
        const t = await sequelize.transaction();

        try {
            // Verificar que todos los productos estén activos
            for (const item of orderData.items) {
                const product = await ProductModel.findByPk(item.productId);
                if (!product || !product.active) {
                    throw new Error(`Producto no disponible: ${item.productId}`);
                }
            }

            const order = await OrderModel.create({
                userId,
                status: 'pending',
                total: 0,
                paymentMethod: orderData.paymentMethod,
                shippingAddress: orderData.shippingAddress
            }, { transaction: t });

            let total = 0;

            for (const item of orderData.items) {
                const product = await ProductModel.findByPk(item.productId);
                
                // Usar el método interno de updateStock
                await dataProduct.updateStock(product.id, -item.quantity);

                await OrderItemModel.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: product.price * item.quantity
                }, { transaction: t });

                total += product.price * item.quantity;
            }

            await order.update({ total }, { transaction: t });
            await t.commit();
            
            return await this.getOrderById(order.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getOrderById(id, userRole, userId) {
        const order = await OrderModel.findByPk(id, {
            include: [
                {
                    model: OrderItemModel,
                    include: [ProductModel]
                },
                {
                    model: UserModel,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!order) {
            throw new Error('Orden no encontrada');
        }

        // Solo el propietario o admin pueden ver la orden
        if (order.userId !== userId && userRole !== 'admin') {
            throw new Error('No autorizado para ver esta orden');
        }

        return order;
    }

    async getUserOrders(userId, userRole) {
        const query = {
            include: [
                {
                    model: OrderItemModel,
                    include: [ProductModel]
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        // Si es admin, puede ver todas las órdenes
        if (userRole === 'admin') {
            return await OrderModel.findAll(query);
        }

        // Si es usuario normal, solo ve sus órdenes
        query.where = { userId };
        return await OrderModel.findAll(query);
    }

    async cancelOrder(id, userId, userRole) {
        const t = await sequelize.transaction();

        try {
            const order = await OrderModel.findByPk(id, {
                include: [OrderItemModel],
                transaction: t
            });

            if (!order) {
                throw new Error('Orden no encontrada');
            }

            // Solo el propietario o admin pueden cancelar la orden
            if (order.userId !== userId && userRole !== 'admin') {
                throw new Error('No autorizado para cancelar esta orden');
            }

            // Verificar el tiempo límite para cancelar (24 horas)
            const orderTime = new Date(order.createdAt).getTime();
            const currentTime = new Date().getTime();
            const hoursDiff = (currentTime - orderTime) / (1000 * 60 * 60);

            if (hoursDiff > 24 && userRole !== 'admin') {
                throw new Error('No se puede cancelar la orden después de 24 horas');
            }

            if (order.status === 'completed') {
                throw new Error('No se puede cancelar una orden completada');
            }

            if (order.status === 'cancelled') {
                throw new Error('La orden ya está cancelada');
            }

            // Devolver el stock
            for (const item of order.OrderItems) {
                await dataProduct.updateStock(item.productId, item.quantity);
            }

            await order.update({ status: 'cancelled' }, { transaction: t });
            await t.commit();
            
            return { message: 'Orden cancelada exitosamente' };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Método solo para administradores
    async updateOrderStatus(id, status, userRole) {
        if (userRole !== 'admin') {
            throw new Error('No autorizado - Solo administradores pueden actualizar el estado de las órdenes');
        }

        const order = await OrderModel.findByPk(id);
        if (!order) {
            throw new Error('Orden no encontrada');
        }

        const validStatus = ['pending', 'processing', 'completed', 'cancelled'];
        if (!validStatus.includes(status)) {
            throw new Error('Estado de orden inválido');
        }

        return await order.update({ status });
    }
}

module.exports = new DataOrder(); 