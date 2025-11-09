const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vulnerable_app'
};

const db = mysql.createConnection(dbConfig);

// Conectar a MySQL con retry
const connectWithRetry = () => {
  db.connect((err) => {
    if (err) {
      console.error('Error conectando a MySQL:', err);
      console.log('Reintentando en 5 segundos...');
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado a MySQL');
    }
  });
};

module.exports = { db, connectWithRetry };
