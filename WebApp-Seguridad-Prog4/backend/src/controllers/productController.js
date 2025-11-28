const { db } = require('../config/database');

const getProducts = (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const filters = [];
  const params = [];

  if (category) {
    filters.push('category = ?');
    params.push(category);
  }

  if (search) {
    filters.push('name LIKE ?');
    params.push(`%${search}%`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const query = `SELECT id, name, category, price, description, stock FROM products ${whereClause}`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener productos de la base de datos', err);
      return res.status(500).json({ message: 'No se pudo obtener la lista de productos' });
    }
    res.json(results);
  });
};

module.exports = {
  getProducts
};