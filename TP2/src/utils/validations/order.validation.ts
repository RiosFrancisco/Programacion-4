import { z } from "zod";

export const SizeSchema = z
  .string()
  .refine((size) => ["S", "M", "L"].includes(size), {
    message: "El tamaño debe ser 'S', 'M' o 'L'",
  });

export const StatusSchema = z
  .string()
  .refine(
    (status) => ["delivered", "preparing", "cancelled"].includes(status),
    {
      message: "El estado debe ser 'delivered', 'preparing' o 'cancelled'",
    }
  );

export const CreateOrderSchema = z.object({
  id: z.number().min(1, "El id no puede estar vacío"),
  size: SizeSchema,
  toppings: z.array(z.string()).min(1, "Debe tener al menos un topping"),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  status: StatusSchema,
});

export const StatusQuerySchema = z.object({
  status: StatusSchema,
});

export const OrderIdSchema = z.object({
  id: z.string().min(1, "El id no puede estar vacío"),
});
