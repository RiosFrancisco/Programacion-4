import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';
import OrderSummary from '../src/components/orderSumary';

test('calcula el total actualizado al agregar productos', async () => {
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

  await waitFor(() => {
    const orderList = screen.getByRole('list', { name: /pedido/i });
    expect(orderList).toHaveTextContent('Café');
    expect(orderList).toHaveTextContent('Mocca');
  });

  await waitFor(() => {
    expect(screen.getByText(/Total: \$5.50/i)).toBeInTheDocument();
  });

  await userEvent.click(cafeButton);

  await waitFor(() => {
    expect(screen.getByText(/Total: \$7.50/i)).toBeInTheDocument();
  });
});


