const Repository = require('./repository');

class CartsRepository extends Repository {
    async create(attrs) {
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }
};

module.exports = new CartsRepository('carts.json');