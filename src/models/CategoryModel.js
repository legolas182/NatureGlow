const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class CategoryModel extends Model {
        static associate(models) {
            CategoryModel.hasMany(models.ProductModel, {
                foreignKey: 'categoryId',
                as: 'products'
            });
        }
    }

    CategoryModel.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.ENUM('facial', 'corporal', 'capilar', 'maquillaje'),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Category',
        timestamps: true
    });

    return CategoryModel;
}; 