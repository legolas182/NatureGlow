const BaseRepository = require('./base.repository');
const { Product } = require('../../models');

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    async findByCategory(category) {
        return await this.model.findAll({
            where: { category }
        });
    }

    async findInStock() {
        return await this.model.findAll({
            where: {
                stock: {
                    [Op.gt]: 0
                }
            }
        });
    }
}

module.exports = new ProductRepository(); 