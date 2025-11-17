import { describe, test, expect, beforeEach } from "vitest";
import { OrderStatus } from "../../models/order";

import { OrderBuilder } from "../../utils/OrderBuilder";
import { OrderServices } from "../../services/order.service";

describe("prueba de ejemplo", () => {
  let crud: OrderServices;

  const order1 = new OrderBuilder()
    .setId(1)
    .setSize("M")
    .setToppings(["pepperoni", "mushrooms"])
    .setAddress("123 Main St")
    .setStatus("preparing")
    .build();
  const order2 = new OrderBuilder()
    .setId(2)
    .setSize("L")
    .setToppings(["sausage", "onions"])
    .setAddress("456 Elm St")
    .setStatus("delivered")
    .build();

  console.log(order1, order2);

  beforeEach(() => {
    crud = new OrderServices();
    crud.createOrder(order1);
    crud.createOrder(order2);
  });

  test("addOrder", () => {
    const newOrder = new OrderBuilder().setId(3).setAddress("789 Oak St").setSize("S").setStatus("preparing").setToppings(["cheese", "mushrooms"]).build();
    crud.createOrder(newOrder);
    console.log(newOrder);
    expect(crud.getOrders()).toHaveLength(3);
  });

  test("getOrderById", () => {
    const order = crud.getOrderById(1);
    expect(order?.getId()).toBe(1);
  });

  test("cancelOrder", () => {
    const result = crud.cancelOrder(1);
    expect(result).toBe("Pedido cancelado");
  });

  test("cancelOrder is delivered", () => {
    expect(() => crud.cancelOrder(2)).toThrowError(
      "El pedido ya fue entregado"
    );
    console.log(order2);
  });

  test("getOrders", () => {
    const orders = crud.getOrders();
    console.log(orders.length);
    expect(orders).toBeInstanceOf(Array);
    expect(orders.length).toBeGreaterThan(1);
  });

  test("getOrdersByStatus", () => {
    const orders = crud.getOrdersByStatus("preparing" as OrderStatus);
    expect(orders.every((order) => order.getStatus() === "preparing")).toBe(
      true
    );
  });
});
