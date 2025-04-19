const request = require('supertest');
const app = require('../app');

describe('Productos API', () => {
  let createdProductId;
  const testProduct = {
    name: "Crema Hidratante Natural",
    description: "Crema hidratante con ingredientes naturales",
    price: 29.99,
    stock: 100,
    categoryId: 1,
    brand: "Nature Glow",
    imageUrl: "https://example.com/crema.jpg",
    ingredients: "Agua, aloe vera, aceite de jojoba",
    usage: "Aplicar sobre la piel limpia"
  };

  // GET /api/products
  test('GET /api/products - Debe listar todos los productos', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /api/products
  test('POST /api/products - Debe crear un nuevo producto', async () => {
    const response = await request(app)
      .post('/api/products')
      .send(testProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdProductId = response.body.id;
  });

  // GET /api/products/:id
  test('GET /api/products/:id - Debe obtener un producto específico', async () => {
    const response = await request(app)
      .get(`/api/products/${createdProductId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdProductId);
    expect(response.body.name).toBe(testProduct.name);
  });

  // PUT /api/products/:id
  test('PUT /api/products/:id - Debe actualizar un producto', async () => {
    const updateData = {
      name: "Crema Hidratante Premium",
      price: 34.99
    };

    const response = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.name).toBe(updateData.name);
    expect(response.body.price).toBe(updateData.price);
  });

  // DELETE /api/products/:id
  test('DELETE /api/products/:id - Debe eliminar un producto', async () => {
    await request(app)
      .delete(`/api/products/${createdProductId}`)
      .expect(204);

    // Verificar que el producto fue eliminado
    await request(app)
      .get(`/api/products/${createdProductId}`)
      .expect(404);
  });
}); 