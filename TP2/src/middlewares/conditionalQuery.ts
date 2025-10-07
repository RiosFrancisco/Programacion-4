import { NextFunction, Request, Response } from "express";
import { StatusQuerySchema } from "../utils/validations/order.validation";

export const conditionalValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.status) {
    return next();
  }
  const result = StatusQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0]?.message,
    });
  }
  return next();
};
