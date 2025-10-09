import { ZodSchema, ZodError } from "zod";
import { RequestHandler } from "express";

export const getStatusCodeFromZodError = (error: ZodError): number => {
  const hasTypeError = error.issues.some(
    (issue) => issue.code === "invalid_type" || issue.code === "invalid_key"
  );
  if (hasTypeError) {
    return 400;
  }
  return 422;
};

export const validate =
  (
    schema: ZodSchema,
    source: "body" | "query" | "params" = "body"
  ): RequestHandler =>
  (req, res, next) => {
    const input = (req as any)[source];
    const result = (schema as any).safeParse(input);
    if (!result.success) {
      const err = result.error as ZodError;
      const statusCode = getStatusCodeFromZodError(err);
      return res
        .status(statusCode)
        .json({ error: "ValidationError", details: err.flatten() });
    }
    (req as any)[source] = result.data;
    next();
  };
