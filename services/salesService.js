const SalesModel = require('../models/salesModel');
const SalesProductsModel = require('../models/salesProductsModel');
const ProductsModel = require('../models/productsModel');
const { requestArraySchema, productIdSchema } = require('../schemas/salesSchema');

const create = async (requestArray) => {
  if (!requestArray.length) return { error: { code: 400, message: '"product_id" is required' } };

  const requestArrayError = await requestArraySchema(requestArray);
  if (requestArrayError) return requestArrayError;

  const product = await productIdSchema(requestArray);
  if (product.error) return { error: product.error };

  const { id } = await SalesModel.create();

  await Promise.all(requestArray.map(async ({ product_id: productId, quantity }) => {
      await SalesProductsModel.create(+id, +productId, +quantity);
      const { name, quantity: oldQuantity } = await ProductsModel.findById(+productId);
      const newQuantity = oldQuantity - quantity;
      await ProductsModel.update(+productId, name, newQuantity);
  }));  

  return {
    id,
    itemsSold: requestArray,
  };
};

const getAll = async () => {
  const sales = await SalesModel.getAll();

  const salesReturn = Array.from(sales);
  salesReturn.sort((a, b) => a.product_id - b.product_id);
  salesReturn.sort((a, b) => a.saleId - b.saleId);

  return salesReturn;
};

const findById = async (id) => {
  const sales = await SalesModel.findById(id);

  if (!sales) {
    return {
      error: {
        code: 404,
        message: 'Sale not found',
      },
    };
  }

  const salesReturn = Array.from(sales);
  salesReturn.sort((a, b) => a.product_id - b.product_id);

  return salesReturn;
};

const update = async (requestArray) => {
  if (!requestArray.length) return { error: { code: 400, message: '"product_id" is required' } };

  const requestArrayError = await requestArraySchema(requestArray);
  if (requestArrayError) return requestArrayError;

  const product = await productIdSchema(requestArray);
  if (product.error) return { error: product.error };

  const { id, product_id, quantity } = requestArray[0];

  const itemData = { ...requestArray[0] };
  delete itemData.id;

  await SalesProductsModel.update(id, product_id, quantity);
  
  return {
    saleId: id,
    itemUpdated: [itemData],
  };
};

const removeById = async (id) => {
  const salesExist = await SalesModel.findById(id);

  if (!salesExist) {
    return { error: { code: 404, message: 'Sale not found' } };
  }

  const productsArray = salesExist
    .map(({ product_id: productId, quantity }) => ({ productId, quantity }));
  
  await Promise.all(productsArray.map(async ({ productId, quantity }) => {
    const { name, quantity: oldQuantity } = await ProductsModel.findById(+productId);
    const newQuantity = +oldQuantity + +quantity;
    await ProductsModel.update(+productId, name, newQuantity);
  }));  

  await SalesModel.removeById(id);
  return salesExist;
};

module.exports = {
  create,
  getAll,
  findById,
  update,
  removeById,
};
