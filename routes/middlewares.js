const crypto = require('crypto');
const CartsRepository = require('../repositories/cart');
module.exports = {
    async checkSessionID(req, res, next) {
        if (!req.session.sessionID) {
            req.session.sessionID = crypto.randomBytes(16).toString('hex');
        }
        next();
    },
    async checkCard(req, res, next) {
        let cart = await CartsRepository.getOne(req.session.sessionID);
        if (!cart) {
            await CartsRepository.create({ id: req.session.sessionID, items: [] });
        }
        next();
    }

}