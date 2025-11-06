import {  http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/menu', () => {
    return HttpResponse.json([
        { id: '1', name: 'Café', price: 2 },
        { id: '2', name: 'Mocca', price: 3.5 },
        { id: '3', name: 'Latte', price: 3 },
      ])
    
  }),
  http.post('/api/orders', () =>
    HttpResponse.json({ message: 'Pedido confirmado' })
  ),

];
