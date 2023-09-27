const express = require('express');


const productsRepo = require('../repositories/products');
const indexTemplate = require('../views/index');


const router = express.Router();

router.get('/', async (req, res) => {

    const products = await productsRepo.getAll();
    res.send(indexTemplate({ products }));
});


module.exports = router;