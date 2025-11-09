const request = require('supertest');
const express = require('express');
const productRoutes = require('../../src/routes/products');

describe('Seguridad: SQL Injection', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', productRoutes);
  });

  test('❌ DEBE FALLAR: No debe permitir inyección SQL en el parámetro category', async () => {
    const sqlInjections = [
      "' OR '1'='1",
      "'; DROP TABLE products; --",
      "' UNION SELECT * FROM users --",
      "1' AND (SELECT COUNT(*) FROM users) > 0 --",
      "' OR 1=1 --"
    ];

    for (const injection of sqlInjections) {
      const response = await request(app)
        .get('/api/products')
        .query({ category: injection });

      // No debe devolver todos los productos ni error SQL
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
      expect(response.text).not.toContain('error');
      expect(response.text).not.toContain('SQL');
    }
  });

  test('❌ DEBE FALLAR: No debe permitir inyección SQL en el parámetro search', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ search: "'; DELETE FROM products WHERE '1'='1" });

    // La búsqueda debe ser segura
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('❌ DEBE FALLAR: No debe exponer información de la base de datos', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ 
        category: "' UNION SELECT table_name, column_name, null, null, null FROM information_schema.columns --"
      });

    // No debe revelar estructura de la BD
    const responseText = JSON.stringify(response.body);
    expect(responseText).not.toContain('information_schema');
    expect(responseText).not.toContain('table_name');
    expect(responseText).not.toContain('users');
  });

  test('❌ DEBE FALLAR: Debe usar consultas parametrizadas', async () => {
    // Intento de inyección que cambiaría la lógica
    const response = await request(app)
      .get('/api/products')
      .query({ 
        category: "Electronics' OR category='Furniture"
      });

    // Solo debe devolver productos de la categoría exacta
    response.body.forEach(product => {
      expect(product.category).toBe("Electronics' OR category='Furniture");
    });
  });

  test('❌ DEBE FALLAR: No debe permitir comentarios SQL', async () => {
    const injections = [
      "Electronics' --",
      "Electronics' /*",
      "Electronics' #"
    ];

    for (const injection of injections) {
      const response = await request(app)
        .get('/api/products')
        .query({ category: injection });

      // Debe tratar los comentarios como parte del string
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    }
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR SQL INJECTION', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Usar consultas parametrizadas/prepared statements:
       const query = 'SELECT * FROM products WHERE category = ? AND name LIKE ?';
       const params = [category, '%' + search + '%'];
       
       db.query(query, params, (err, results) => {
         // Manejar resultados
       });
    
    2. Validar y sanitizar entrada:
       const { body, validationResult } = require('express-validator');
       
       router.get('/products',
         query('category').isAlphanumeric().optional(),
         query('search').escape().optional(),
         (req, res) => {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
           }
         }
       );
    
    3. Usar un ORM como Sequelize:
       const products = await Product.findAll({
         where: {
           category: category,
           name: { [Op.like]: '%' + search + '%' }
         }
       });
    
    4. Principio de menor privilegio:
       - Crear usuario de BD con permisos limitados
       - Solo SELECT en tablas necesarias
       - Sin permisos de DROP, CREATE, etc.
    
    5. Escapar caracteres especiales:
       const mysql = require('mysql2');
       const escapedCategory = mysql.escape(category);
    
    6. Nunca concatenar strings para formar queries:
       // MALO: query += " AND category = '" + category + "'";
       // BUENO: usar placeholders ?
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
