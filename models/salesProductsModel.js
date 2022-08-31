const connection = require('./connection');

const QUERY = {
  create: `INSERT INTO StoreManager.sales_products
  (sale_id, product_id, quantity)
  VALUES (?, ?, ?);`,
  update: `UPDATE StoreManager.sales_products
  SET quantity = ?
  WHERE sale_id = ? AND product_id = ?;`,
  dropConstraint: 'SET FOREIGN_KEY_CHECKS=0',
  returnConstraint: 'SET FOREIGN_KEY_CHECKS=1',
};

const create = async (salesId, productId, quantity) => {
  try {
    await connection.execute(QUERY.dropConstraint);
    await connection
      .execute(QUERY.create, [salesId, productId, quantity]);
    await connection.execute(QUERY.returnConstraint);

    return {
      salesId,
      productId,
      quantity,
    };
  } catch (err) {
    console.error(err);
  }
};

const update = async (saleId, productId, quantity) => {
  try {
    await connection.execute(QUERY.dropConstraint);
    await connection
    .execute(QUERY.update, [quantity, saleId, productId]);
    await connection.execute(QUERY.returnConstraint);
   
    return {
      saleId,
      itemUpdated: [{
        productId,
        quantity,
      }],
    };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  create,
  update,
};
