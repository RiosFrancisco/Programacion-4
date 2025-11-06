import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../src/components/menu';
import OrderSummary from '../src/components/orderSumary';
import { OrderProvider } from '../src/components/pedido';
import { server } from '../src/mocks/server';
import { http, HttpResponse } from 'msw';

test('test completo: cargar menú, agregar, total, enviar y reset', async () => {
  server.use(
    http.get('/api/menu', () =>
      HttpResponse.json([
        { id: '1', name: 'Café', price: 2 },
        { id: '2', name: 'Mocca', price: 3.5 },
        { id: '3', name: 'Latte', price: 3 },
      ])
    )
  );

  server.use(
    http.post('/api/orders', () => HttpResponse.json({ message: 'Pedido confirmado' }))
  );

  render(
    <OrderProvider>
      <Menu />
      <OrderSummary />
    </OrderProvider>
  );

  const cafeButton = await screen.findByRole('button', { name: /Agregar Café/i });
  const moccaButton = await screen.findByRole('button', { name: /Agregar Mocca/i });
  const latteButton = await screen.findByRole('button', { name: /Agregar Latte/i });

  await userEvent.click(cafeButton);
  await userEvent.click(moccaButton);
  await userEvent.click(latteButton);

  await waitFor(() => {
    const orderList = screen.getByRole('list', { name: /pedido/i });
    expect(orderList).toHaveTextContent('Café');
    expect(orderList).toHaveTextContent('Mocca');
    expect(orderList).toHaveTextContent('Latte');
  });

  expect(screen.getByText(/Total: \$8.50/i)).toBeInTheDocument();

  const enviarButton = screen.getByRole('button', { name: /Enviar pedido/i });
  await userEvent.click(enviarButton);

  await waitFor(() => {
    expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
  });

  const orderList = screen.getByRole('list', { name: /pedido/i });
  expect(orderList).toBeEmptyDOMElement();

  expect(screen.getByText(/Total: \$0.00/i)).toBeInTheDocument();
});
