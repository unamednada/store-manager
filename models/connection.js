require('dotenv').config();

const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB_NAME || 'StoreManager',
  port: process.env.MYSQL_PORT || 3306,
});

module.exports = connection;
