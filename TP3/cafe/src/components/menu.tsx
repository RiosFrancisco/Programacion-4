import { useEffect, useState } from 'react';
import { type Product } from '../types/product';
import { useOrder } from './pedido';

export default function Menu() {
  const [menu, setMenu] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const { addToOrder } = useOrder();

  useEffect(() => {
    fetch('/api/menu')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar menú');
        return res.json();
      })
      .then(data => setMenu(data))
      .catch(() => setError('Error al cargar menú'));
  }, []);

  if (error) return <p>{error}</p>;
  if (menu.length === 0) return <p>No hay productos disponibles</p>;

  return (
    <section>
      <h2>Menú</h2>
      <ul role="list">
        {menu.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price.toFixed(2)}
            <button onClick={() => addToOrder(product)}>Agregar {product.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
