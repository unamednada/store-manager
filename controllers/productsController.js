const ProductsService = require('../services/productsService');

const create = async (req, res) => {
  const { name, quantity } = req.body;
  
  const product = await ProductsService.create(name, quantity);

  if (product.error) {
    return res.status(product.error.code).json({ message: product.error.message });
  }

  res.status(201).json(product);
};

const getAll = async (_req, res) => {
  const products = await ProductsService.getAll();

  return res.status(200).json(products);
};

const findById = async (req, res) => {
  const { id } = req.params;

  const product = await ProductsService.findById(id);

  if (product.error) {
    return res.status(product.error.code).json({ message: product.error.message });
  }

  res.status(200).json(product);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  const editedProduct = await ProductsService.update(id, name, quantity);

  if (editedProduct.error) {
    return res.status(editedProduct.error.code).json({ message: editedProduct.error.message });
  }

  res.status(200).json(editedProduct);
};

const removeById = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await ProductsService.removeById(id);

  if (deletedProduct.error) {
    return res.status(deletedProduct.error.code).json({ message: deletedProduct.error.message });
  }

  res.status(200).json(deletedProduct);
};

module.exports = {
  create,
  getAll,
  findById,
  update,
  removeById,
};
