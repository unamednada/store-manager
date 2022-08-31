const ProductsModel = require('../models/productsModel');

const CODES = {
  NO_DATA: 400,
  INVALID_DATA: 422,
};

const messages = {
  noProductId: '"product_id" is required',
  productIdNotFound: 'Product not found',
};

const { quantitySchema } = require('./productsSchema');

const productIdSchema = async (requestArray) => {
  const productNotFound = Promise.all(requestArray.map(async ({ product_id }) => {
    const product = await ProductsModel.findById(product_id);

    if (!product) return { error: { code: 422, message: 'Product not found' } };
    return product;
  }));

  const anyError = (await productNotFound).find(({ error }) => error);
  if (anyError) return anyError;

  const [product] = await productNotFound;

  return product;
};

const requestArraySchema = async (requestArray) => {
  const errors = requestArray.map(({ product_id: productId, quantity }) => {
    if (!productId) return { error: { code: CODES.NO_DATA, message: messages.noProductId } };

    const quantityError = quantitySchema(quantity);
    if (quantityError) return quantityError;

    return null;
  });

  const anyError = errors.find(({ error }) => error);
  if (anyError) { return anyError; }
  return null;
};

module.exports = {
  requestArraySchema,
  productIdSchema,
};
