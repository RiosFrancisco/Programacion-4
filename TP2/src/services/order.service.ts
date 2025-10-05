import { OrderCrud } from "../models/interface/order.interface";
import { Order, OrderStatus } from "../models/order";
import mockOrder from "../models/mockOrder";

class OrderServices implements OrderCrud {
  getOrders(): Order[] {
    return mockOrder.getOrders();
  }
  getOrdersByStatus(status: OrderStatus): Order[] {
    return mockOrder.getOrdersByStatus(status);
  }
  createOrder(order: Order): void {
    mockOrder.createOrder(order);
  }
  getOrderById(id: string): Order | undefined {
    return mockOrder.getOrderById(id);
  }
  cancelOrder(id: string): string {
    return mockOrder.cancelOrder(id);
  }
}
