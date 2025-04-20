# Nature Grow API

API REST para la gestión de productos naturales de cuidado personal.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Credenciales por Defecto](#credenciales-por-defecto)
- [Endpoints](#endpoints)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Base de Datos](#base-de-datos)
- [Pruebas con Postman](#pruebas-con-postman)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Patrón Repository](#patrón-repository)
- [Pruebas Unitarias](#pruebas-unitarias)
- [GitFlow](#gitflow)
- [Implementación Detallada](#implementación-detallada)

## Requisitos

- Node.js >= 14.x
- MySQL >= 8.0
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd nature-grow
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Crear la base de datos en MySQL:
```sql
CREATE DATABASE nature_grow;
```

5. Iniciar el servidor:
```bash
npm run dev
```

## Configuración

### Variables de Entorno (.env)

```env
# Base de Datos
DB_NAME=nature_grow
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost

# Servidor
PORT=3000

# JWT
JWT_SECRET=your-secret-key

# Admin por Defecto
ADMIN_EMAIL=admin@naturegrow.com
ADMIN_PASSWORD=admin123456
```

## Credenciales por Defecto

### Administrador
```json
{
    "email": "admin@naturegrow.com",
    "password": "admin123456"
}
```

## Endpoints

### Autenticación y Usuarios

#### Registro Público (Solo usuarios normales)
```http
POST /api/users/register
Content-Type: application/json

{
    "name": "Usuario Prueba",
    "email": "usuario@test.com",
    "password": "123456"
}

Respuesta:
{
    "message": "Usuario registrado exitosamente",
    "token": "jwt_token",
    "user": {
        "id": 1,
        "name": "Usuario Prueba",
        "email": "usuario@test.com",
        "role": "user"
    }
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
    "email": "usuario@test.com",
    "password": "123456"
}

Respuesta:
{
    "message": "Login exitoso",
    "token": "jwt_token",
    "user": {
        "id": 1,
        "name": "Usuario Prueba",
        "email": "usuario@test.com",
        "role": "user"
    }
}
```

#### Obtener Perfil
```http
GET /api/users/profile
Authorization: Bearer jwt_token

Respuesta:
{
    "id": 1,
    "name": "Usuario Prueba",
    "email": "usuario@test.com",
    "role": "user"
}
```

### Rutas de Administrador

#### Crear Usuario (puede crear usuarios normales y admins)
```http
POST 
/api/users/users
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Nuevo Admin",
    "email": "admin2@naturegrow.com",
    "password": "123456",
    "role": "admin"
}

Respuesta:
{
    "message": "Usuario creado exitosamente",
    "user": {
        "id": 2,
        "name": "Nuevo Admin",
        "email": "admin2@naturegrow.com",
        "role": "admin",
        "isActive": true
    }
}
```

#### Listar Usuarios
```http
GET /api/users/users
Authorization: Bearer jwt_token

Respuesta:
{
    "users": [
        {
            "id": 1,
            "name": "Usuario Prueba",
            "email": "usuario@test.com",
            "role": "user",
            "isActive": true,
            "createdAt": "2024-02-20T..."
        },
        // ...más usuarios
    ]
}
```

### Categorías

#### Crear Categoría (Admin)
```http
POST /api/categories
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Cuidado Facial",
    "type": "facial",
    "description": "Productos para el cuidado de la piel facial"
}

Respuesta:
{
    "id": 1,
    "name": "Cuidado Facial",
    "type": "facial",
    "description": "Productos para el cuidado de la piel facial",
    "isActive": true
}
```

#### Listar Categorías (Público)
```http
GET /api/categories

Respuesta:
{
    "categories": [
        {
            "id": 1,
            "name": "Cuidado Facial",
            "type": "facial",
            "description": "Productos para el cuidado de la piel facial",
            "isActive": true,
            "products": [
                {
                    "id": 1,
                    "name": "Crema Hidratante"
                }
            ]
        }
    ]
}
```

### Productos

#### Crear Producto (Admin)
```http
POST /api/products
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Crema Hidratante",
    "description": "Crema hidratante para todo tipo de piel",
    "price": 29.99,
    "stock": 100,
    "categoryId": 1,
    "brand": "Nature Grow",
    "ingredients": "Agua, glicerina, aceites naturales",
    "usage": "Aplicar en rostro limpio con movimientos circulares",
    "featured": false
}

Respuesta:
{
    "id": 1,
    "name": "Crema Hidratante",
    "description": "Crema hidratante para todo tipo de piel",
    "price": 29.99,
    "stock": 100,
    "categoryId": 1,
    "brand": "Nature Grow",
    "isActive": true
}
```

#### Listar Productos (Público)
```http
GET /api/products

Respuesta:
{
    "products": [
        {
            "id": 1,
            "name": "Crema Hidratante",
            "description": "Crema hidratante para todo tipo de piel",
            "price": 29.99,
            "stock": 100,
            "category": {
                "id": 1,
                "name": "Cuidado Facial"
            }
        }
    ]
}
```

#### Actualizar Stock de Producto (Admin)
```http
PATCH /api/products/1/stock
Content-Type: application/json
Authorization: Bearer {tu_token_de_administrador}

{
    "quantity": 150
}

Respuesta:
{
    "id": 1,
    "name": "Crema Hidratante",
    "stock": 150,
    "message": "Stock actualizado exitosamente"
}
```

#### Cambiar Estado del Producto (Admin)
```http
PATCH /api/products/1/toggle-status
Authorization: Bearer {tu_token_de_administrador}

Respuesta:
{
    "id": 1,
    "name": "Crema Hidratante",
    "isActive": false,
    "message": "Estado del producto actualizado exitosamente"
}
```

#### Actualizar Producto (Admin)
```http
PUT /api/products/1
Content-Type: application/json
Authorization: Bearer {tu_token_de_administrador}

{
    "name": "Crema Hidratante Premium",
    "description": "Crema hidratante mejorada para todo tipo de piel",
    "price": 34.99,
    "categoryId": 1,
    "brand": "Nature Grow Premium",
    "ingredients": "Agua purificada, glicerina orgánica, aceites naturales premium",
    "usage": "Aplicar en rostro limpio con suaves movimientos circulares",
    "stock": 50
}

Respuesta:
{
    "id": 1,
    "name": "Crema Hidratante Premium",
    "description": "Crema hidratante mejorada para todo tipo de piel",
    "price": 34.99,
    "stock": 50,
    "categoryId": 1,
    "brand": "Nature Grow Premium",
    "isActive": true
}
```

#### Eliminar Producto (Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {token}

Respuesta:
{
    "message": "Producto eliminado exitosamente"
}
```

## Ejemplos de Uso

### 1. Flujo de Usuario Normal

1. Registro:
```bash
curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{
    "name": "Usuario Prueba",
    "email": "usuario@test.com",
    "password": "123456"
}'
```

2. Login:
```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{
    "email": "usuario@test.com",
    "password": "123456"
}'
```

### 2. Flujo de Administrador

1. Login como admin:
```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{
    "email": "admin@naturegrow.com",
    "password": "admin123456"
}'
```

2. Crear nuevo admin:
```bash
curl -X POST http://localhost:3000/api/users/users \
-H "Authorization: Bearer {token}" \
-H "Content-Type: application/json" \
-d '{
    "name": "Nuevo Admin",
    "email": "admin2@naturegrow.com",
    "password": "123456",
    "role": "admin"
}'
```

## Códigos de Respuesta

- 200: Éxito
- 201: Creado exitosamente
- 400: Error de validación
- 401: No autorizado
- 403: Prohibido (no tiene permisos)
- 404: No encontrado
- 500: Error del servidor

## Notas de Seguridad

1. El sistema crea automáticamente un admin por defecto al iniciar
2. Los usuarios normales no pueden:
   - Crear otros usuarios
   - Cambiar su propio rol
   - Acceder a funciones administrativas
3. Los administradores pueden:
   - Crear otros administradores
   - Gestionar todos los usuarios
   - No pueden eliminar el último administrador del sistema

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Estructura del Proyecto

```
src/
├── controllers/     # Controladores de la aplicación
├── models/         # Modelos de datos
├── repositories/   # Implementación del patrón Repository
│   ├── interfaces/    # Interfaces de repositorios
│   └── implementations/  # Implementaciones concretas
├── services/       # Lógica de negocio
├── middleware/     # Middleware de autenticación y validación
└── tests/          # Pruebas unitarias
```

## Patrón Repository

El proyecto implementa el patrón Repository para separar la lógica de acceso a datos:

```typescript
// Ejemplo de interfaz de repositorio
interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product>;
    create(product: Product): Promise<Product>;
    update(id: number, product: Product): Promise<Product>;
    delete(id: number): Promise<void>;
}

// Implementación concreta
class ProductRepository implements IProductRepository {
    // Implementación de métodos
}
```

## Pruebas Unitarias

Para ejecutar las pruebas:

```bash
npm run test
```

### Estructura de Tests
```
src/tests/
├── controllers/
│   ├── AuthController.test.ts     (144 líneas)
│   ├── CategoryController.test.ts (161 líneas)
│   └── ProductController.test.ts  (107 líneas)
└── middleware/
    └── authMiddleware.test.ts     (84 líneas)
```

### Componentes Testeados

#### 1. AuthController
- **Login**:
  - ✓ Autenticación exitosa con credenciales correctas
  - ✓ Manejo de contraseña incorrecta (401)
  - ✓ Manejo de usuario no existente (404)
- **Registro**:
  - ✓ Registro exitoso de nuevo usuario
  - ✓ Validación de email duplicado (400)

#### 2. CategoryController
- **Operaciones CRUD**:
  - ✓ Listado de categorías activas
  - ✓ Búsqueda por ID
  - ✓ Creación de categoría
  - ✓ Actualización de datos
  - ✓ Manejo de estado activo/inactivo
- **Validaciones**:
  - ✓ Categoría no encontrada
  - ✓ Errores de base de datos
  - ✓ Datos inválidos

#### 3. ProductController
- **Gestión de Productos**:
  - ✓ Listado de productos activos
  - ✓ Actualización de stock
  - ✓ Control de estado del producto
- **Manejo de Errores**:
  - ✓ Producto no encontrado
  - ✓ Validación de stock
  - ✓ Errores de operación

#### 4. Middleware de Autenticación
- **Validación de Token**:
  - ✓ Token válido
  - ✓ Token ausente
  - ✓ Token inválido
- **Control de Roles**:
  - ✓ Acceso de administrador
  - ✓ Restricción de usuarios no admin

### Configuración de Testing

```javascript
// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/types/**/*.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}
```

### Scripts Disponibles
```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    }
}
```

### Cobertura Actual
- **Líneas de Código**: 85%
- **Funciones**: 90%
- **Ramas**: 85%
- **Declaraciones**: 85%

### Mejores Prácticas Implementadas

1. **Organización**:
   - Tests agrupados por funcionalidad
   - Nombres descriptivos
   - Estructura consistente

2. **Mocking**:
   - Repositorios simulados
   - JWT simulado
   - Request/Response simulados

3. **Aserciones**:
   - Validación de estados HTTP
   - Verificación de respuestas
   - Comprobación de llamadas

4. **Manejo de Errores**:
   - Casos de borde
   - Errores esperados
   - Validaciones de entrada

## GitFlow

El proyecto sigue el flujo de trabajo GitFlow:

### Ramas Principales
- `main`: Código en producción
- `develop`: Desarrollo activo

### Ramas de Soporte
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes
- `release/*`: Preparación de versiones

### Flujo de Trabajo
1. Crear rama feature desde develop
```bash
git checkout develop
git checkout -b feature/nueva-funcionalidad
```

2. Desarrollar y hacer commit de los cambios
```bash
git add .
git commit -m "Descripción de los cambios"
```

3. Finalizar feature
```bash
git checkout develop
git merge feature/nueva-funcionalidad
```

4. Preparar release
```bash
git checkout -b release/1.0.0
# Realizar ajustes finales
git checkout main
git merge release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
```

## Implementación Detallada

### Controladores
Cada controlador implementa una interfaz específica y sigue el patrón Repository:

#### AuthController
```typescript
class AuthController {
    constructor(private userRepository: IUserRepository) {}
    
    // Métodos principales
    async login(req: Request, res: Response): Promise<void>
    async register(req: Request, res: Response): Promise<void>
}
```

#### CategoryController
```typescript
class CategoryController {
    constructor(private categoryRepository: ICategoryRepository) {}
    
    // Métodos CRUD
    async findAll(req: Request, res: Response): Promise<void>
    async findById(req: Request, res: Response): Promise<void>
    async create(req: Request, res: Response): Promise<void>
    async update(req: Request, res: Response): Promise<void>
    async toggleStatus(req: Request, res: Response): Promise<void>
}
```

#### ProductController
```typescript
class ProductController {
    constructor(private productRepository: IProductRepository) {}
    
    // Métodos principales
    async findAll(req: Request, res: Response): Promise<void>
    async updateStock(req: Request, res: Response): Promise<void>
    async toggleStatus(req: Request, res: Response): Promise<void>
}
```

### Middleware de Autenticación
```typescript
// Middleware de validación de token
export const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void>

// Middleware de verificación de rol admin
export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void>
```

## Resumen de Implementación

### 1. Arquitectura del Proyecto

La API está construida siguiendo una arquitectura en capas:

```
Cliente <-> Controllers <-> Repositories <-> Base de Datos
                ↑
            Middleware
```

#### Componentes Principales:
1. **Controllers**: Manejan las peticiones HTTP
2. **Repositories**: Gestionan el acceso a datos
3. **Middleware**: Controla autenticación y autorización
4. **Tests**: Garantizan la calidad del código

### 2. Funcionalidades Implementadas

#### Autenticación y Usuarios
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Gestión de roles (admin/user)
- ✅ Protección de rutas

#### Gestión de Categorías
- ✅ CRUD completo
- ✅ Control de estado activo/inactivo
- ✅ Validaciones de existencia
- ✅ Relación con productos

#### Gestión de Productos
- ✅ CRUD completo
- ✅ Control de stock
- ✅ Estado activo/inactivo
- ✅ Asociación con categorías

### 3. Pruebas Implementadas

#### Cobertura Total
```
Controllers: 4 archivos   (412 líneas)
Middleware:  1 archivo    (84 líneas)
Total:       496 líneas de pruebas
```

#### Desglose por Componente

1. **AuthController** (144 líneas)
   - Login:
     - ✓ Credenciales correctas
     - ✓ Contraseña incorrecta
     - ✓ Usuario no existe
   - Registro:
     - ✓ Usuario nuevo
     - ✓ Email duplicado

2. **CategoryController** (161 líneas)
   - CRUD:
     - ✓ Listar categorías
     - ✓ Buscar por ID
     - ✓ Crear nueva
     - ✓ Actualizar existente
   - Estado:
     - ✓ Activar/Desactivar
     - ✓ Validaciones

3. **ProductController** (107 líneas)
   - Productos:
     - ✓ Listar activos
     - ✓ Gestión de stock
     - ✓ Control de estado
   - Validaciones:
     - ✓ Existencia
     - ✓ Stock disponible

4. **Middleware** (84 líneas)
   - JWT:
     - ✓ Validación de token
     - ✓ Token ausente/inválido
   - Roles:
     - ✓ Verificación admin
     - ✓ Acceso denegado

### 4. Guía de Uso del Testing

#### Ejecutar Pruebas
```bash
# Todas las pruebas
npm run test

# Con watch mode
npm run test:watch

# Con cobertura
npm run test:coverage
```

#### Estructura de una Prueba
```typescript
describe('Componente', () => {
    beforeEach(() => {
        // Configuración inicial
    })

    describe('Funcionalidad', () => {
        it('debería comportarse de X manera', async () => {
            // Arrange
            const input = {...}
            
            // Act
            await controller.method()
            
            // Assert
            expect(result).toBe(expected)
        })
    })
})
```

#### Mocking
```typescript
// Repository Mock
const mockRepository = {
    find: jest.fn(),
    create: jest.fn()
} as jest.Mocked<IRepository>

// Request/Response Mock
const mockRequest = {
    body: {},
    params: {}
} as Request
```

### 5. Métricas de Calidad

#### Cobertura de Código
- Líneas: > 80%
- Funciones: > 80%
- Ramas: > 80%
- Statements: > 80%

#### Estándares
- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Prettier para formato
- ✅ Husky para pre-commit

### 6. Mejores Prácticas Aplicadas

#### En Código
- ✅ Principios SOLID
- ✅ DRY (Don't Repeat Yourself)
- ✅ Inyección de dependencias
- ✅ Manejo de errores consistente

#### En Testing
- ✅ AAA Pattern (Arrange-Act-Assert)
- ✅ Pruebas independientes
- ✅ Mocking efectivo
- ✅ Nombres descriptivos