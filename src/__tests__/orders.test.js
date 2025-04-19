const request = require('supertest');
const app = require('../app');

describe('Órdenes API', () => {
  let createdOrderId;
  let testUserId;
  let testProductId;

  // Datos de prueba
  const testOrder = {
    userId: null, // Se asignará después
    shippingAddress: "Calle Principal 123",
    shippingCity: "Ciudad Test",
    shippingZip: "12345",
    shippingCountry: "País Test",
    paymentMethod: "credit_card",
    items: [
      {
        productId: null, // Se asignará después
        quantity: 2
      }
    ]
  };

  // Configuración inicial
  beforeAll(async () => {
    // Crear usuario de prueba
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        firstName: "Cliente",
        lastName: "Test",
        email: "cliente.test@example.com",
        password: "password123",
        phone: "1234567890",
        address: "Dirección Test",
        role: "client"
      });
    testUserId = userResponse.body.id;
    testOrder.userId = testUserId;

    // Crear producto de prueba
    const productResponse = await request(app)
      .post('/api/products')
      .send({
        name: "Producto Test",
        description: "Descripción test",
        price: 19.99,
        stock: 50,
        categoryId: 1,
        brand: "Marca Test"
      });
    testProductId = productResponse.body.id;
    testOrder.items[0].productId = testProductId;
  });

  // GET /api/orders
  test('GET /api/orders - Debe listar todas las órdenes', async () => {
    const response = await request(app)
      .get('/api/orders')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /api/orders
  test('POST /api/orders - Debe crear una nueva orden', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(testOrder)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(testUserId);
    expect(response.body.status).toBe('pending');
    createdOrderId = response.body.id;
  });

  // GET /api/orders/:id
  test('GET /api/orders/:id - Debe obtener una orden específica', async () => {
    const response = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdOrderId);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].productId).toBe(testProductId);
  });

  // PUT /api/orders/:id
  test('PUT /api/orders/:id - Debe actualizar una orden', async () => {
    const updateData = {
      status: 'processing',
      paymentStatus: 'completed'
    };

    const response = await request(app)
      .put(`/api/orders/${createdOrderId}`)
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe(updateData.status);
    expect(response.body.paymentStatus).toBe(updateData.paymentStatus);
  });

  // DELETE /api/orders/:id
  test('DELETE /api/orders/:id - Debe eliminar una orden', async () => {
    await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .expect(204);

    // Verificar que la orden fue eliminada
    await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .expect(404);
  });

  // Limpieza después de las pruebas
  afterAll(async () => {
    // Eliminar usuario y producto de prueba
    await request(app).delete(`/api/users/${testUserId}`);
    await request(app).delete(`/api/products/${testProductId}`);
  });
}); 