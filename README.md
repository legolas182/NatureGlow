# Nature Glow - Tienda Virtual de Cuidado Personal 

## Descripción
Nature Glow es una API REST para una tienda virtual especializada en productos de cuidado personal. El sistema está construido con Node.js, Express y MySQL, siguiendo una arquitectura MVC (Modelo-Vista-Controlador) con capas adicionales para el manejo de datos.

## Estructura del Proyecto
```
nature_glow/
├── src/
│   ├── controllers/     # Controladores de la aplicación
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de la API
│   ├── data/          # Capa de acceso a datos
│   │   ├── repositories/  # Repositorios
│   │   └── services/     # Servicios de negocio
│   └── config/        # Configuraciones
├── docs/             # Documentación de la API
│   └── nature_glow_collection.json  # Colección de Postman
├── .env              # Variables de entorno
└── package.json      # Dependencias del proyecto
```

## Modelos de Datos

### Category (Categorías)
- id: INT (PK, Auto-increment)
- name: STRING (Unique)
- description: TEXT
- imageUrl: STRING
- active: BOOLEAN

### Product (Productos)
- id: INT (PK, Auto-increment)
- name: STRING
- description: TEXT
- price: DECIMAL(10,2)
- stock: INT
- categoryId: INT (FK)
- brand: STRING
- imageUrl: STRING
- ingredients: TEXT
- usage: TEXT
- active: BOOLEAN
- featured: BOOLEAN

### User (Usuarios)
- id: INT (PK, Auto-increment)
- firstName: STRING
- lastName: STRING
- email: STRING (Unique)
- password: STRING (Encrypted)
- phone: STRING
- address: TEXT
- role: ENUM('client', 'admin')
- active: BOOLEAN
- lastLogin: DATE

### Order (Pedidos)
- id: INT (PK, Auto-increment)
- userId: INT (FK)
- status: ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')
- total: DECIMAL(10,2)
- shippingAddress: TEXT
- shippingCity: STRING
- shippingZip: STRING
- shippingCountry: STRING
- paymentStatus: ENUM('pending', 'completed', 'failed', 'refunded')
- paymentMethod: ENUM('credit_card', 'debit_card', 'cash', 'transfer')
- notes: TEXT
- shippingCost: DECIMAL(10,2)
- discount: DECIMAL(10,2)

### OrderItem (Items del Pedido)
- id: INT (PK, Auto-increment)
- orderId: INT (FK)
- productId: INT (FK)
- quantity: INT
- price: DECIMAL(10,2)
- discount: DECIMAL(10,2)
- subtotal: VIRTUAL

## Endpoints de la API

### Productos
- GET /api/products - Listar todos los productos
- GET /api/products/:id - Obtener un producto específico
- POST /api/products - Crear un nuevo producto
- PUT /api/products/:id - Actualizar un producto
- DELETE /api/products/:id - Eliminar un producto

### Usuarios
- GET /api/users - Listar usuarios
- GET /api/users/:id - Obtener un usuario específico
- POST /api/users - Crear un nuevo usuario
- PUT /api/users/:id - Actualizar un usuario
- DELETE /api/users/:id - Eliminar un usuario

### Órdenes
- GET /api/orders - Listar órdenes
- GET /api/orders/:id - Obtener una orden específica
- POST /api/orders - Crear una nueva orden
- PUT /api/orders/:id - Actualizar una orden
- DELETE /api/orders/:id - Eliminar una orden

## Configuración del Proyecto

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_NAME=nature_glow_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### Instalación
1. Clonar el repositorio
```bash
git clone [url-del-repositorio]
```

2. Instalar dependencias
```bash
npm install
```

3. Crear la base de datos en MySQL
```sql
CREATE DATABASE nature_glow_db;
```

4. Iniciar el servidor
```bash
npm run dev
```

## Características Implementadas
- Arquitectura MVC con capas adicionales (repositories, services)
- Modelos de datos con relaciones
- Validaciones de datos
- Encriptación de contraseñas
- Manejo de errores centralizado
- Configuración de CORS
- Logging de errores

## Tecnologías Utilizadas
- Node.js
- Express.js
- Sequelize (ORM)
- MySQL
- bcryptjs (encriptación)
- dotenv (variables de entorno)
- cors (seguridad)

## Próximas Características
- Implementación de autenticación JWT
- Sistema de roles y permisos
- Validación de datos avanzada
- Documentación con Swagger
- Tests unitarios y de integración
- Sistema de caché
- Manejo de imágenes
- Sistema de notificaciones 

## Documentación de la API

### Colección de Postman
Se ha incluido una colección de Postman completa para probar todos los endpoints de la API. La colección se encuentra en el archivo `docs/nature_glow_collection.json`.

Para utilizarla:

1. Abre Postman
2. Haz clic en "Import"
3. Selecciona el archivo `docs/nature_glow_collection.json`
4. La colección se importará con todos los endpoints organizados por categorías:
   - Productos
   - Usuarios
   - Órdenes

La colección incluye una variable de entorno `base_url` configurada como `http://localhost:3000`. Puedes modificar esta variable según tu entorno de desarrollo.