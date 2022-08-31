const express = require('express');

const router = express.Router();

const SalesController = require('../controllers/salesController');
const quantityMiddleware = require('../middlewares/quantityMiddleware');

router.get('/:id', SalesController.findById);
router.put('/:id', SalesController.update);
router.post('/', quantityMiddleware, SalesController.create);
router.get('/', SalesController.getAll);
router.delete('/:id', SalesController.removeById);

module.exports = router;
