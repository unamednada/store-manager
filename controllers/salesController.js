const SalesService = require('../services/salesService');

const create = async (req, res) => {
  const requestArray = req.body;

  const sale = await SalesService.create(requestArray);

  if (sale.error) {
    return res.status(sale.error.code).json({ message: sale.error.message });
  }

  res.status(201).json(sale);
};

const getAll = async (_req, res) => {
  const sales = await SalesService.getAll();

  res.status(200).json(sales);
};

const findById = async (req, res) => {
  const { id } = req.params;
  
  const sales = await SalesService.findById(id);

  if (sales.error) {
    return res.status(sales.error.code).json({ message: sales.error.message });
  }

  res.status(200).json(sales);
};

const update = async (req, res) => {
  const { id } = req.params;
  const productData = req.body[0];

  const sale = await SalesService.update([{ id, ...productData }]);

  if (sale.error) {
    return res.status(sale.error.code).json({ message: sale.error.message });
  }

  res.status(200).json(sale);
};

const removeById = async (req, res) => {
  const { id } = req.params;

  const deletedSale = await SalesService.removeById(+id);

  if (deletedSale.error) {
    return res.status(deletedSale.error.code).json({ message: deletedSale.error.message });
  }

  res.status(200).json(deletedSale);
};

module.exports = {
  create,
  getAll,
  findById,
  update,
  removeById,
};
