import { describe, test, expect, beforeEach } from "vitest";
import { Order } from "../models/order";
import { MockOrder } from "../models/mockOrder";
import { OrderCrud } from "../models/interface/order.interface";
import { OrderBuilder } from "../utils/OrderBuilder";

describe("prueba de ejemplo", () => {
  let crud: OrderCrud;

  const order = new Order(
    "1",
    "M",
    ["pepperoni", "mushrooms"],
    "123 Main St",
    "preparing"
  );
  const order2 = new Order(
    "2",
    "L",
    ["sausage", "onions"],
    "456 Elm St",
    "delivered"
  );

  beforeEach(() => {
    crud = new MockOrder();
    crud.createOrder(order);
    crud.createOrder(order2);
  });

  test("addOrder", () => {
    const newOrder = new OrderBuilder().setId("3").build();
    crud.createOrder(newOrder);
    console.log(newOrder)
    expect(crud.getOrders()).toHaveLength(3);
  });

  test("getOrderById", () => {
    const order = crud.getOrderById("1");
    expect(order?.getId()).toBe("1");
  });

  test("cancelOrder", () => {
    const result = crud.cancelOrder("1");
    expect(result).toBe("Pedido cancelado");
  });

  test("cancelOrder is delivered", () => {
    expect(() => crud.cancelOrder("2")).toThrowError(
      "El pedido ya fue entregado"
    );
  });

  test("getOrders", () => {
    const orders = crud.getOrders();
    expect(orders).toHaveLength(2);
  });

  test("getOrdersByStatus", () => {
    const orders = crud.getOrdersByStatus("preparing");
    expect(orders.every((order) => order.getStatus() === "preparing")).toBe(
      true
    );
  });
});
