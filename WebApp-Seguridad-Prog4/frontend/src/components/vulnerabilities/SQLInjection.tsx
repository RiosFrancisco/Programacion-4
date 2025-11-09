import React, { useState } from 'react';
import apiService from '../../services/api';
import { Product } from '../../types';

interface InjectionExample {
  label: string;
  category: string;
  search: string;
}

const SQLInjection: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState<string>('');

  const handleSearch = async (): Promise<void> => {
    setError('');
    
    // Mostrar la query construida (para fines educativos)
    let query = 'SELECT * FROM products WHERE 1=1';
    if (category) query += ` AND category = '${category}'`;
    if (search) query += ` AND name LIKE '%${search}%'`;
    setSqlQuery(query);

    try {
      const response = await apiService.getProducts({ category, search });
      setProducts(response);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al buscar productos');
      setProducts([]);
    }
  };

  const injectionExamples: InjectionExample[] = [
    {
      label: 'Ver todos los productos',
      category: "' OR '1'='1",
      search: ''
    },
    {
      label: 'SQL Error (comilla simple)',
      category: "'",
      search: ''
    },
    {
      label: 'UNION para ver usuarios',
      category: "' UNION SELECT id, username, password, email, 0 FROM users -- ",
      search: ''
    },
    {
      label: 'Obtener información de DB',
      category: "' UNION SELECT 1, database(), version(), user(), 0 -- ",
      search: ''
    },
    {
      label: 'Listar tablas',
      category: "' UNION SELECT 1, table_name, 3, 4, 5 FROM information_schema.tables WHERE table_schema=database() -- ",
      search: ''
    }
  ];

  const renderProductOrData = (item: any, index: number) => {
    // Si es un producto normal
    if (item.name && item.category) {
      return (
        <div key={index} className="product-card">
          <h3>{item.name}</h3>
          <p>Categoría: {item.category}</p>
          <p className="price">${item.price}</p>
          <p>{item.description}</p>
          <p>Stock: {item.stock}</p>
        </div>
      );
    }
    
    // Si es data inyectada
    return (
      <div key={index} className="product-card">
        {Object.keys(item).map((key, idx) => (
          <p key={idx}><strong>{key}:</strong> {item[key] || item[idx]}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="vulnerability-section">
      <h2>SQL Injection</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> Las consultas SQL se construyen concatenando 
        directamente las entradas del usuario sin sanitizar, permitiendo la inyección de SQL.
      </div>

      <div className="form-group">
        <label>Categoría:</label>
        <input 
          type="text" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ej: Electronics"
        />
      </div>

      <div className="form-group">
        <label>Buscar producto:</label>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre del producto"
        />
      </div>

      <button onClick={handleSearch} className="btn btn-primary">
        Buscar Productos
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Ejemplos de inyección:</h3>
        {injectionExamples.map((example, index) => (
          <button 
            key={index}
            className="btn btn-danger"
            onClick={() => {
              setCategory(example.category);
              setSearch(example.search);
            }}
            style={{ margin: '5px' }}
          >
            {example.label}
          </button>
        ))}
      </div>

      {sqlQuery && (
        <div style={{ marginTop: '20px' }}>
          <h3>Query SQL generada:</h3>
          <pre style={{ fontSize: '12px' }}>{sqlQuery}</pre>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '20px' }}>
          <strong>Error SQL:</strong> {error}
        </div>
      )}

      {products.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultados:</h3>
          <div className="products-grid">
            {products.map((product, index) => renderProductOrData(product, index))}
          </div>
        </div>
      )}

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Impacto:</strong> Un atacante puede:
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          <li>Ver datos de otras tablas (usuarios, contraseñas)</li>
          <li>Modificar o eliminar datos</li>
          <li>Ejecutar comandos en el servidor (en algunos casos)</li>
          <li>Obtener información sobre la estructura de la base de datos</li>
        </ul>
      </div>
    </div>
  );
};

export default SQLInjection;
