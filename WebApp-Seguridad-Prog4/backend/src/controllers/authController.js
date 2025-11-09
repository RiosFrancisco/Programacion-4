const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// VULNERABLE: Sin rate limiting para prevenir brute force
const login = async (req, res) => {
  const { username, password } = req.body;
  
  const query = `SELECT * FROM users WHERE username = ?`;
  
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'supersecret123'
    );
    
    res.json({ token, username: user.username });
  });
};

const register = async (req, res) => {
  const { username, password, email } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.json({ message: 'Usuario registrado con éxito' });
  });
};

const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    req.session.userId = decoded.id;
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// VULNERABLE: Blind SQL Injection
const checkUsername = (req, res) => {
  const { username } = req.body;
  
  // VULNERABLE: SQL injection que permite inferir información
  const query = `SELECT COUNT(*) as count FROM users WHERE username = '${username}'`;
  
  db.query(query, (err, results) => {
    if (err) {
      // VULNERABLE: Expone errores de SQL
      return res.status(500).json({ error: err.message });
    }
    
    const exists = results[0].count > 0;
    res.json({ exists });
  });
};

module.exports = {
  login,
  register,
  verifyToken,
  checkUsername
};
