import { Request, Response } from "express";
import { orderSchema } from "../models/interface/order.interface";
import { createOrderService } from "../services/order.service";

export const createOrder = (req: Request, res: Response) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ errors: parsed.error.format() });
  }

  const order = createOrderService(parsed.data);
  res.status(201).json(order);
};
