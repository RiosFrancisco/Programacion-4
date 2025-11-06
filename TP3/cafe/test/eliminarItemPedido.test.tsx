import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';
import OrderSummary from '../src/components/orderSumary';

test('elimina un producto del pedido sin borrar todo', async () => {
  render(
    <OrderProvider>
      <Menu />
      <OrderSummary />
    </OrderProvider>
  );

  // agregar cafe y te al pedido
  const cafeButton = await screen.findByRole('button', { name: /Agregar Café/i });
  const moccaButton = await screen.findByRole('button', { name: /Agregar Mocca/i });

  await userEvent.click(cafeButton);
  await userEvent.click(moccaButton);

  // ver si estan
  await waitFor(() => {
    const orderList = screen.getByRole('list', { name: /pedido/i });
    expect(orderList).toHaveTextContent('Café');
    expect(orderList).toHaveTextContent('Mocca');
  });

  // eliminar el elemento te
  const orderList = screen.getByRole('list', { name: /pedido/i });
  const moccaItem = within(orderList).getByText((content, element) =>
    element?.tagName.toLowerCase() === 'li' && content.includes('Mocca')
  );
  const eliminarMocca = within(moccaItem).getByRole('button', { name: /Eliminar/i });
  await userEvent.click(eliminarMocca);

  // verificar que solo quedo el cafe
  await waitFor(() => {
    const updatedOrderList = screen.getByRole('list', { name: /pedido/i });
    expect(updatedOrderList).toHaveTextContent('Café');
    expect(updatedOrderList).not.toHaveTextContent('Mocca');
    expect(screen.getByText(/Total: \$2.00/i)).toBeInTheDocument();
  });
});

