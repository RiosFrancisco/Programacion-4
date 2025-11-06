import { useState } from 'react';
import { useOrder } from './pedido';

export default function OrderSummary() {
  const { order, removeFromOrder, clearOrder } = useOrder();
  const [message, setMessage] = useState('');

  const total = order.reduce((sum, product) => sum + product.price, 0);

  const handleSendOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      setMessage(data.message);
      clearOrder();
    } catch {
      setMessage('Error al enviar pedido');
    }
  };

  return (
    <section>
      <h2>Pedido</h2>
      <ul role="list" aria-label="pedido">
        {order.map((product, index) => (
          <li key={`${product.id}-${index}`}> 
            {product.name} - ${product.price.toFixed(2)}
            <button
              onClick={e => {
                e.stopPropagation();
                removeFromOrder(index);
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={handleSendOrder}>Enviar pedido</button>
      {message && <p>{message}</p>}
    </section>
  );
}



