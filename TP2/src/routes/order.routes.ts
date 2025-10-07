import { Router } from "express";
import { OrderControllers } from "../controllers/order.controllers";
import { validate } from "../middlewares/validate";
import {
  CreateOrderSchema,
  OrderIdSchema,
} from "../utils/validations/order.validation";
import { conditionalValidation } from "../middlewares/conditionalQuery";

const router = Router();
const orderController = new OrderControllers();

// traer todos los pedidos o por estado
router.get("/", conditionalValidation, (req, res) => {
  if (req.query.status) {
    orderController.getOrdersByStatus(req, res);
  } else {
    orderController.getOrders(req, res);
  }
});

//crear pedido
router.post(
  "/",
  validate(CreateOrderSchema, "body"),
  orderController.createOrder
);

// traer pedido por id
router.get("/:id", validate(OrderIdSchema, "params"), orderController.getOrderById);

// cancelar pedido
router.post("/:id/cancel", validate(OrderIdSchema, "params"), orderController.cancelOrder);

export default router;
