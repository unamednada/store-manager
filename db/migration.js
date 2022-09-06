const connection = require('../models/connection');

const QUERY = `
CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL auto_increment,
    name VARCHAR(30) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS sales (
    id INT NOT NULL auto_increment,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS sales_products (
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (sale_id)
        REFERENCES sales (id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE CASCADE
) ENGINE=INNODB;

SET SQL_SAFE_UPDATES = 0;`;

const migrate = async () => {
  await connection.execute(QUERY);
  console.log('Migration successful');
};

if (require.main === module) {
  migrate();
}
