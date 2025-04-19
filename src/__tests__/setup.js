const { sequelize } = require('../models');

beforeAll(async () => {
  // Sincronizar la base de datos en modo test
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cerrar la conexión a la base de datos
  await sequelize.close();
}); 