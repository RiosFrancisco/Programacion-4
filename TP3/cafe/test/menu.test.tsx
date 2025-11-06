import { render, screen, waitFor } from '@testing-library/react';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';

describe('Visualización inicial del menú', () => {
  it('muestra los productos del menú al ingresar', async () => {
    render(
      <OrderProvider>
        <Menu />
      </OrderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Café - $2.00')).toBeInTheDocument();
      expect(screen.getByText('Mocca - $3.50')).toBeInTheDocument();
      expect(screen.getByText('Latte - $3.00')).toBeInTheDocument();
    });

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });
});
