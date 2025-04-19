const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ProductModel extends Model {}

    ProductModel.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        usage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        indexes: [
            {
                fields: ['categoryId']
            },
            {
                fields: ['name']
            }
        ]
    });

    return ProductModel;
}; 