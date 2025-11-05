import { http, HttpResponse } from "msw";

export const handlers = [
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

  http.post("http://localhost/api/orders", async ({ request }) => {
    const body = await request.json();
    console.log("Pedido recibido:", body);

    return HttpResponse.json(
      { message: "Pedido confirmado" },
      { status: 200 }
    );
  }),
];
