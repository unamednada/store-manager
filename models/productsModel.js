const connection = require('./connection');

const QUERY = {
  create: 'INSERT INTO StoreManager.products (name, quantity) VALUES (?, ?);',
  findByName: 'SELECT id, name, quantity FROM StoreManager.products WHERE name = ?;',
  getAll: 'SELECT id, name, quantity FROM StoreManager.products;',
  findById: 'SELECT id, name, quantity FROM StoreManager.products WHERE id = ?;',
  update: 'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?;',
  removeById: 'DELETE FROM StoreManager.products WHERE id = ?;',
};

const create = async (name, quantity) => {
  const result = await connection
    .execute(QUERY.create, [name, quantity]);
  
  const [{ insertId }] = result;

  return {
    id: insertId,
    name,
    quantity,
  };
};

const findByName = async (name) => {
  const [result] = await connection
    .execute(QUERY.findByName, [name]);
  
  if (!result.length) {
    return null;
  }
  return result[0];
};

const getAll = async () => {
  const [products] = await connection
    .execute(QUERY.getAll);
  
  return products;
};

const findById = async (id) => {
  const [result] = await connection
    .execute(QUERY.findById, [id]);

  if (!result.length) {
    return null;
  }
  return result[0];
};

const update = async (id, name, quantity) => {
  await connection
    .execute(QUERY.update, [name, quantity, id]);
  
  return {
    id,
    name,
    quantity,
  };
};

const removeById = async (id) => {
  await connection
    .execute(QUERY.removeById, [id]);

  return true;
};

module.exports = {
  create,
  findByName,
  getAll,
  findById,
  update,
  removeById,
};
