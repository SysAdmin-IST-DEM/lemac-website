import { type ZodObject, type ZodRawShape, z } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export function parseBody<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.strip().safeParse(req.body);

    if (!result.success) {
      // Format Zod errors nicely
      const errors = z.treeifyError(result.error);

      console.log({
        message: 'Invalid request body',
        errors,
      });

      return res.status(400).json({
        message: 'Invalid request body',
        errors,
      });
    }

    req.body = result.data;
    next();
  };
}

export type RequestWithBody<S extends z.ZodTypeAny> =
  Request<{ id: string }, any, z.infer<S>>;