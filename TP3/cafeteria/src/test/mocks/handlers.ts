// src/test/mocks/handlers.ts
import { http, HttpResponse } from "msw";

// Definimos los manejadores de las peticiones que queremos interceptar
export const handlers = [
  // 🟢 Intercepta GET a '/api/menu'
  http.get("http://localhost/api/menu", () => {
    return HttpResponse.json(
      [
        { id: 1, titulo: "Mocca", precio: 2000 },
        { id: 2, titulo: "Late", precio: 2000 },
        { id: 3, titulo: "Capucchino", precio: 2000 },
      ],
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 🟢 Intercepta POST a '/api/orders'
  http.post("http://localhost/api/orders", async ({ request }) => {
    const body = await request.json();
    console.log("Pedido recibido:", body);

    // Retorna respuesta simulada del backend
    return HttpResponse.json(
      { message: "Pedido confirmado" },
      { status: 200 }
    );
  }),
];
