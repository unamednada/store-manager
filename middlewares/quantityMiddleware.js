const ProductsModel = require('../models/productsModel');

module.exports = async (req, res, next) => {
  const requestArray = req.body;

  let error = false;

  try {
    await Promise.all(requestArray.map(async ({ product_id: productId, quantity }) => {
      const { quantity: oldQuantity } = await ProductsModel.findById(+productId);
      const newQuantity = oldQuantity - quantity;
      if (newQuantity < 1) error = true;
    }));
    if (error) return res.status(422).json({ message: 'Such amount is not permitted to sell' });

    next();
  } catch (_) {
    res.status(400).json({ message: '"product_id" is required' });
  }
};
