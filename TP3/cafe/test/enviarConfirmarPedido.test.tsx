import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';
import OrderSummary from '../src/components/orderSumary';
import { server } from '../src/mocks/server';
import { http, HttpResponse } from 'msw';

test('envía el pedido y confirma', async () => {
  server.use(
    http.post('/api/orders', () => {
      return HttpResponse.json({ message: 'Pedido confirmado' }, { status: 200 });
    })
  );

  render(
    <OrderProvider>
      <Menu />
      <OrderSummary />
    </OrderProvider>
  );

  const cafeButton = await screen.findByRole('button', { name: /Agregar Café/i });
  const moccaButton = await screen.findByRole('button', { name: /Agregar Mocca/i });
  await userEvent.click(cafeButton);
  await userEvent.click(moccaButton);

  const enviarButton = screen.getByRole('button', { name: /Enviar pedido/i });
  await userEvent.click(enviarButton);

  await waitFor(() => {
    expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
  });
  const orderList = screen.getByRole('list', { name: /pedido/i });
  expect(orderList).toBeEmptyDOMElement();
});

