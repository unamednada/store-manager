const ProductsModel = require('../models/productsModel');
const { nameSchema, quantitySchema } = require('../schemas/productsSchema');

const create = async (name, quantity) => {
  const nameError = nameSchema(name).error;
  const quantityError = quantitySchema(quantity).error;

  if (nameError) { return { error: nameError }; }
  if (quantityError) { return { error: quantityError }; }

  const productExists = await ProductsModel.findByName(name);

  if (productExists) {
    return { error: { code: 409, message: 'Product already exists' } };
  }

  const product = await ProductsModel.create(name, quantity);

  return product;
};

const getAll = async () => {
  const products = await ProductsModel.getAll();

  return products;
};

const findById = async (id) => {
  const product = await ProductsModel.findById(id);

  if (!product) {
    return { error: { code: 404, message: 'Product not found' } };
  }

  return product;
};

const update = async (id, name, quantity) => {
  const nameError = nameSchema(name).error;
  const quantityError = quantitySchema(quantity).error;

  if (nameError) { return { error: nameError }; }
  if (quantityError) { return { error: quantityError }; }

  const productExists = await ProductsModel.findById(id);

  if (!productExists) {
    return { error: { code: 404, message: 'Product not found' } };
  }

  const product = await ProductsModel.update(id, name, quantity);

  return product;
};

const removeById = async (id) => {
  const productExists = await ProductsModel.findById(id);

  if (!productExists) {
    return { error: { code: 404, message: 'Product not found' } };
  }

  await ProductsModel.removeById(id);
  return productExists;
};

module.exports = {
  create,
  getAll,
  findById,
  update,
  removeById,
};
