import { Order, OrderStatus } from "../order";

export interface OrderCrud {
  getOrders(): Order[];
  getOrdersByStatus(status: OrderStatus): Order[];
  createOrder(order: Order): void;
  getOrderById(id: number): Order | undefined;
  cancelOrder(id: number): string;
}
