import { calculatePrice } from "../utils/prices";
import { OrderCrud } from "./interface/order.interface";
import { Order, OrderStatus } from "./order";

export class MockOrder implements OrderCrud {
  protected orders: Order[];
  constructor() {
    this.orders = new Array<Order>();
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter((order) => order.getStatus() === status);
  }

  createOrder(order: Order): void {
    order.setPrice(calculatePrice(order.getSize(), order.getToppings()));
    this.orders.push(order);
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find((order) => order.getId() === id);
  }

  cancelOrder(id: number): string {
    const order = this.getOrderById(id);
    if (!order) {
      throw new Error("Orden no encontrada");
    }
    if (order.getStatus() === "delivered") {
      throw new Error("El pedido ya fue entregado");
    }
    if (order.getStatus() === "cancelled") {
      throw new Error("El pedido ya fue cancelado");
    }
    order.setStatus("cancelled" as OrderStatus);
    return "Pedido cancelado";
  }
}

export default new MockOrder();
