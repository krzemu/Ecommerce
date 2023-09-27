const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
    async create(attrs) {
        const records = await this.getAll();
        attrs['id'] = this.randomId(4);
        const salt = this.randomId(8);
        const buf = await scrypt(attrs.password, salt, 64);
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        this.writeAll(records);
        return record;
    }
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');
        const hashSupplied = await scrypt(supplied, salt, 64);

        return hashed === hashSupplied.toString('hex');
    }
}
// const test = async () => {const x = new UserRepository('users.json');}
// test();
module.exports = new UserRepository(`users.json`);

