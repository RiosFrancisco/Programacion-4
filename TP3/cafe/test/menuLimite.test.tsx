import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../src/mocks/server';
import { http, HttpResponse } from 'msw';
import Menu from '../src/components/menu';
import { OrderProvider } from '../src/components/pedido';

test('muestra mensaje cuando el menú está vacío', async () => {
  server.use(
    http.get('/api/menu', () => {
      return HttpResponse.json([]);
    })
  );

  render(
    <OrderProvider>
      <Menu />
    </OrderProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/No hay productos disponibles/i)).toBeInTheDocument();
  });
});

test('muestra mensaje cuando hay error 500', async () => {
  server.use(
    http.get('/api/menu', () => {
      return HttpResponse.text('Error interno', { status: 500 });
    })
  );

  render(
    <OrderProvider>
      <Menu />
    </OrderProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Error al cargar menú/i)).toBeInTheDocument();
  });
});

