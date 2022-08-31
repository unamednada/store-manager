const express = require('express');

const router = express.Router();

const ProductsController = require('../controllers/productsController');

router.get('/:id', ProductsController.findById);
router.put('/:id', ProductsController.update);
router.post('/', ProductsController.create);
router.get('/', ProductsController.getAll);
router.delete('/:id', ProductsController.removeById);

module.exports = router;
