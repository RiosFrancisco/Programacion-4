import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';
import OrderSummary from '../src/components/orderSumary';

test('agrega un producto al pedido', async () => {
  render(
    <OrderProvider>
      <Menu />
      <OrderSummary />
    </OrderProvider>
  );

  const addButton = await screen.findByRole('button', { name: /Agregar Café/i });
  await userEvent.click(addButton);

  await waitFor(() => {
    const orderList = screen.getByRole('list', { name: /pedido/i });
    expect(orderList).toHaveTextContent('Café');
  });
});

