const fs = require('fs');
const crypto = require('crypto');


module.exports = class Repository {
    constructor(filename) {
        if (!filename) throw new Error('Creating repository requires a filename');
        this.filename = filename;
        try { fs.accessSync(this.filename) }
        catch (err) { fs.writeFileSync(this.filename, '[]'); }

    }

    // METHODS
    // ***********************************
    async create(attrs) {
        attrs.id = this.randomId(4);
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, { encoding: 'utf-8' })
        )
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(item => item.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(item => item.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(item => item.id === id);
        if (!record) throw new Error(`ID ${id} doesn't exists`);
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
    // ***********************************
    // END

    // Assets
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));

    }

    randomId(bytes) {
        return crypto.randomBytes(bytes).toString('hex');
    }
};