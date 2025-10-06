import { Order, OrderStatus } from "../order";
import { z } from "zod";

export interface OrderCrud {
  getOrders(): Order[];
  getOrdersByStatus(status: OrderStatus): Order[];
  createOrder(order: Order): void;
  getOrderById(id: string): Order | undefined;
  cancelOrder(id: string): string;
}

export const orderSchema = z.object({
  adress: z.string().min(10, "La direccion debe tener al menos 10 caracteres"),
  items: z.array(
    z.object({
      name: z.string().min(1, "El nombre del item es obligatorio"),
      quantity: z.number().int().positive("La cantidad debe ser mayor a 0")
    })
  ).nonempty("El pedido debe tener al menos un item"),
});

export type OrderInput = z.infer<typeof orderSchema>;