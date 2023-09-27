const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice, requireImage } = require('./validators');
const { handleErrors, requireAuth } = require('./middlewares');


const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products',
    requireAuth,
    async (req, res) => {
        const products = await productsRepo.getAll();
        res.send(productsIndexTemplate({ products }));

    });

router.get('/admin/products/new',
    requireAuth,
    async (req, res) => {

        res.send(productsNewTemplate({}));
    });

router.post(
    '/admin/products/new',
    upload.single('image'),
    requireAuth, [
    requireTitle,
    requirePrice,
],
    handleErrors(productsNewTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ image, title, price });
        res.redirect('/admin/products');
    }
);

router.get(
    '/admin/products/:id/edit',
    requireAuth,
    (async (req, res) => {
        const product = await productsRepo.getOne(req.params.id);
        if (!product) return res.send('Product not found');
        res.send(productsEditTemplate({ product }));
    })
);
router.post(
    '/admin/products/:id/edit',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async req => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        console.log(req.params);
        const changes = req.body;
        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }
        try { await productsRepo.update(req.params.id, changes); }
        catch (err) { res.send('Could not find item'); }
        res.redirect('/admin/products');
    }
);

router.post(
    '/admin/products/:id/delete',
    requireAuth,
    async (req, res) => {
        const product = await productsRepo.getOne(req.params.id);
        if (!product) return res.redirect('/admin/products');
        console.log(req.params.id);
        await productsRepo.delete(req.params.id);
        res.redirect('/admin/products');

    }
);

module.exports = router;

