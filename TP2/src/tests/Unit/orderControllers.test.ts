import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { OrderServices } from '../../services/order.service';

beforeEach(() => {
  vi.clearAllMocks();
});

// retorna sincrónico (service en tu código devuelve Order[])
describe('Order Controller', () => {
  it('GET /orders debería devolver lista de órdenes', async () => {
    (OrderServices.prototype as any).getOrders = vi.fn().mockReturnValue([{ id: 1 }]);

    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  it('GET /orders maneja errores del servicio', async () => {
    (OrderServices.prototype as any).getOrders = vi.fn().mockImplementation(() => { throw new Error('Error simulado'); });

    const res = await request(app).get('/orders');
    expect(res.status).toBe(500);
  });
});