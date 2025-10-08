import { describe, test, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";


vi.mock("../../controllers/order.controllers", () => {
  class OrderControllers {
    private orders: any[] = [];

    getOrders = (req: any, res: any) => {
      return res.status(200).json(this.orders);
    };

    getOrdersByStatus = (req: any, res: any) => {
      const status = req.query.status;
      return res.status(200).json(this.orders.filter((o) => o.status === status));
    };

    createOrder = (req: any, res: any) => {
      const order = req.body;
      this.orders.push(order);
      return res.status(201).json({ message: "Pedido creado", order });
    };

    getOrderById = (req: any, res: any) => {
      const id = Number(req.params.id);
      const order = this.orders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
      return res.status(200).json(order);
    };

    cancelOrder = (req: any, res: any) => {
      const id = Number(req.params.id);
      const order = this.orders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
      if (order.status === "delivered")
        return res.status(400).json({ message: "El pedido ya fue entregado" });
      if (order.status === "cancelled")
        return res.status(400).json({ message: "El pedido ya fue cancelado" });

      order.status = "cancelled";
      return res.status(200).json({ message: "Pedido cancelado" });
    };
  }

  return { OrderControllers };
});


vi.mock("../../middlewares/validate", () => {
  return { validate: () => (req: any, res: any, next: any) => next() };
});
vi.mock("../../middlewares/conditionalQuery", () => {
  return { conditionalValidation: (req: any, res: any, next: any) => next() };
});

describe("order.routes test", () => {
  let app: express.Express;
  let router: any;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../routes/order.routes.js");
    router = mod.default;

    app = express();
    app.use(express.json());
    app.use("/orders", router);
  });

  test("create order", async () => {
    const payload = {
      id: 1,
      size: "M",
      toppings: ["pepperoni"],
      address: "Calle Falsa 123",
      status: "preparing",
    };

    const res = await request(app).post("/orders").send(payload).expect(201);
    expect(res.body).toHaveProperty("message", "Pedido creado");
    expect(res.body.order).toMatchObject(payload);
  });

  test("get all orders", async () => {
    const payload = {
      id: 2,
      size: "L",
      toppings: ["mushrooms"],
      address: "Av Siempre Viva 742",
      status: "preparing",
    };

    await request(app).post("/orders").send(payload).expect(201);

    const res = await request(app).get("/orders").expect(200);
    expect(res.body).toEqual([payload]);
  });

  test("get orders by status", async () => {
    const payload1 = { id: 3, size: "S", toppings: [], address: "A", status: "preparing" };
    const payload2 = { id: 4, size: "M", toppings: [], address: "B", status: "delivered" };

    await request(app).post("/orders").send(payload1).expect(201);
    await request(app).post("/orders").send(payload2).expect(201);

    const res = await request(app).get("/orders").query({ status: "preparing" }).expect(200);
    expect(res.body).toEqual([payload1]);
  });

  test("get order by id", async () => {
    const payload = { id: 5, size: "M", toppings: ["olives"], address: "C", status: "preparing" };

    await request(app).post("/orders").send(payload).expect(201);

    const res = await request(app).get("/orders/5").expect(200);
    expect(res.body).toHaveProperty("id", 5);
    expect(res.body).toMatchObject(payload);
  });

  test("cancel order", async () => {
    const payload = { id: 6, size: "L", toppings: [], address: "D", status: "preparing" };

    await request(app).post("/orders").send(payload).expect(201);

    const cancelRes = await request(app).post("/orders/6/cancel").expect(200);
    expect(cancelRes.body).toHaveProperty("message", "Pedido cancelado");

    const after = await request(app).get("/orders/6").expect(200);
    expect(after.body).toHaveProperty("status", "cancelled");
  });
});