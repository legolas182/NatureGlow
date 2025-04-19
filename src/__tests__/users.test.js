const request = require('supertest');
const app = require('../app');

describe('Usuarios API', () => {
  let createdUserId;
  const testUser = {
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@test.com",
    password: "password123",
    phone: "1234567890",
    address: "Calle Principal 123",
    role: "client"
  };

  // GET /api/users
  test('GET /api/users - Debe listar todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /api/users
  test('POST /api/users - Debe crear un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testUser.email);
    createdUserId = response.body.id;
  });

  // GET /api/users/:id
  test('GET /api/users/:id - Debe obtener un usuario específico', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body).not.toHaveProperty('password');
  });

  // PUT /api/users/:id
  test('PUT /api/users/:id - Debe actualizar un usuario', async () => {
    const updateData = {
      firstName: "Ana María",
      phone: "0987654321"
    };

    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.firstName).toBe(updateData.firstName);
    expect(response.body.phone).toBe(updateData.phone);
  });

  // DELETE /api/users/:id
  test('DELETE /api/users/:id - Debe eliminar un usuario', async () => {
    await request(app)
      .delete(`/api/users/${createdUserId}`)
      .expect(204);

    // Verificar que el usuario fue eliminado
    await request(app)
      .get(`/api/users/${createdUserId}`)
      .expect(404);
  });

  // Prueba de validación de email único
  test('POST /api/users - No debe permitir emails duplicados', async () => {
    // Intentar crear un usuario con el mismo email
    await request(app)
      .post('/api/users')
      .send(testUser)
      .expect(400);
  });
}); 