const express = require('express');
const crypto = require('crypto');

const CartsRepo = require('../repositories/cart');
const productsRepo = require('../repositories/products');
const { checkSessionID, checkCard } = require('./middlewares');
const cartShowTemplate = require('../views/cart');

const router = express.Router();

// Receive a post request to add an item to a cart


router.post(
    '/cart/products',
    checkSessionID,
    checkCard,
    async (req, res) => {
        const cart = await CartsRepo.getOne(req.session.sessionID);
        const item = cart.items.find(item => item.id === req.body.productID);

        if (!item) cart.items.push({ id: req.body.productID, q: 1 });
        else item.q += 1;

        await CartsRepo.update(req.session.sessionID, cart);

        res.redirect('/');
    }
);


router.get(
    '/cart',
    checkSessionID,
    checkCard,
    async (req, res) => {
        const card = await CartsRepo.getOne(req.session.sessionID);
        if (card.items.length < 1) return res.redirect('/');
        const products = [];
        for (let k of card.items) {
            const x = await productsRepo.getOne(k.id);
            x.q = k.q;
            products.push(x);
        }
        res.send(cartShowTemplate({ products, card }));

    }

)

router.post(
    '/cart/products/:id/delete',
    checkSessionID,
    checkCard,
    async (req, res) => {
        const cart = await CartsRepo.getOne(req.session.sessionID);
        const products = cart.items.filter(item => item.id !== req.params.id);
        await CartsRepo.update(req.session.sessionID, { items: products });
        res.redirect('/cart');
    }
);



//  Receive a GET request to show all items in cart




//  Receive a post request to delete an item from a cart




module.exports = router;