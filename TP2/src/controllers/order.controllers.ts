import { Request, Response } from "express";
import { OrderServices } from "../services/order.service";
import { Order, OrderSize, OrderStatus } from "../models/order";
import {
  CreateOrderSchema,
  OrderIdSchema,
  StatusQuerySchema,
} from "../utils/validations/order.validation";

export class OrderControllers {
  private orderService: OrderServices;

  constructor() {
    this.orderService = new OrderServices();
  }

  getOrders = (req: Request, res: Response) => {
    const orders = this.orderService.getOrders();
    res.status(200).json(orders);
  };

  getOrdersByStatus = (req: Request, res: Response) => {
    const result = StatusQuerySchema.safeParse(req.query);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message,
      });
    }

    const status = result.data.status as OrderStatus;
    const orders = this.orderService.getOrdersByStatus(status);
    res.status(200).json(orders);
  };

  createOrder = (req: Request, res: Response) => {
    const result = CreateOrderSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        message: result.error.issues[0]?.message,
      });
    }

    const { id, size, toppings, address, status } = result.data;

    if (this.orderService.getOrderById(id)) {
      return res.status(400).json({ message: "El ID del pedido ya existe" });
    }
    const newOrder = new Order(
      id,
      size as OrderSize,
      toppings,
      address,
      status as OrderStatus
    );

    this.orderService.createOrder(newOrder);
    res.status(201).json({ message: "Pedido creado", order: newOrder });
  };

  getOrderById = (req: Request, res: Response) => {
    const result = OrderIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message,
      });
    }

    const id = parseInt(result.data.id, 10);

    const order = this.orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(order);
  };

  cancelOrder = (req: Request, res: Response) => {
    const result = OrderIdSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message,
      });
    }

    const id = parseInt(result.data.id, 10);

    try {
      const orderStatus = this.orderService.getOrderById(id)?.getStatus();

      if (orderStatus === "delivered") {
        return res.status(409).json({ message: "El pedido ya fue entregado" });
      }

      if (orderStatus === "cancelled") {
        return res.status(409).json({ message: "El pedido ya fue cancelado" });
      }

      const result = this.orderService.cancelOrder(id);
      return res.status(200).json({ message: result });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
}
