const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
    database: process.env.DB_NAME || 'nature_grow',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '062498',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = config; 