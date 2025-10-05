import { Order, OrderStatus } from "../order";

export interface OrderCrud {
  getOrders(): Order[];
  getOrdersByStatus(status: OrderStatus): Order[];
  createOrder(order: Order): void;
  getOrderById(id: string): Order | undefined;
  cancelOrder(id: string): string;
}
