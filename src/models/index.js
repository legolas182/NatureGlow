const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Crear instancia de Sequelize
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging,
        pool: config.pool
    }
);

// Importar definiciones de modelos
const defineUserModel = require('./UserModel');
const defineProductModel = require('./ProductModel');
const defineCategoryModel = require('./CategoryModel');

// Inicializar modelos
const UserModel = defineUserModel(sequelize);
const ProductModel = defineProductModel(sequelize);
const CategoryModel = defineCategoryModel(sequelize);

// Establecer asociaciones
CategoryModel.hasMany(ProductModel, {
    foreignKey: 'categoryId',
    as: 'products'
});

ProductModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    as: 'category'
});

// Exportar modelos y sequelize
module.exports = {
    sequelize,
    UserModel,
    ProductModel,
    CategoryModel
}; 