const { db } = require('../config/database');

// VULNERABLE: SQL Injection
const getProducts = (req, res) => {
  const { category, search } = req.query;
  
  // VULNERABLE: Concatenación directa de strings en SQL
  let query = 'SELECT * FROM products WHERE 1=1';
  
  if (category) {
    query += ` AND category = '${category}'`;
  }
  
  if (search) {
    query += ` AND name LIKE '%${search}%'`;
  }
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

module.exports = {
  getProducts
};
