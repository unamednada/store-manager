const connection = require('./connection');

const QUERY = {
  create: 'INSERT INTO StoreManager.sales (date) VALUES (NOW());',
  getAll: `SELECT
  s.id AS saleId,
  s.date AS date,
  sp.product_id AS product_id,
  sp.quantity AS quantity
  FROM StoreManager.sales AS s
  RIGHT JOIN
  StoreManager.sales_products AS sp
  ON s.id = sp.sale_id;`,
  findById: `SELECT
  s.date AS date,
  sp.product_id AS product_id,
  sp.quantity AS quantity
  FROM StoreManager.sales AS s
  RIGHT JOIN
  StoreManager.sales_products AS sp
  ON s.id = sp.sale_id
  WHERE s.id = ?;`,
  removeById: 'DELETE FROM StoreManager.sales WHERE id = ?;',
};

const create = async () => {
  const result = await connection
    .execute(QUERY.create);

  const [{ insertId }] = result;

  return {
    id: insertId,
  };
};

const getAll = async () => {
  const [sales] = await connection
    .execute(QUERY.getAll);

  return sales;
};

const findById = async (id) => {
  const [sales] = await connection
    .execute(QUERY.findById, [id]);

  if (!sales.length) {
    return null;
  }

  return sales;
};

const removeById = async (id) => {
  await connection
    .execute(QUERY.removeById, [id]);
  
  return true;
};

module.exports = {
  create,
  getAll,
  findById,
  removeById,
};
