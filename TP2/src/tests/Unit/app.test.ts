import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from "../../app";

describe('App', () => {
  it('debería responder con 200 en la ruta raíz', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('debería parsear JSON en peticiones POST (middleware json activo)', async () => {
    (app as any).post('/__test_echo', (req: any, res: any) => {
      res.status(200).json(req.body);
    });

    const payload = { hello: 'world' };
    const res = await request(app).post('/__test_echo').send(payload).set('Content-Type', 'application/json').expect(200);
    expect(res.body).toEqual(payload);
  });
});