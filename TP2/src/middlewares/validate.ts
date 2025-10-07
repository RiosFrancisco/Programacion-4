import { ZodSchema, ZodError } from 'zod';
import { RequestHandler } from 'express';

export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
): RequestHandler => (req, res, next) => {
  const input = (req as any)[source];
  const result = (schema as any).safeParse(input);
  if (!result.success) {
    const err = result.error as ZodError;
    return res.status(400).json({ error: 'ValidationError', details: err.flatten() });
  }
  (req as any)[source] = result.data;
  next();
};