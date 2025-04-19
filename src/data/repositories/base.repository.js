class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const entity = await this.findById(id);
        if (!entity) return null;
        return await entity.update(data);
    }

    async delete(id) {
        const entity = await this.findById(id);
        if (!entity) return false;
        await entity.destroy();
        return true;
    }
}

module.exports = BaseRepository; 