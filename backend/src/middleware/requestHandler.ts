import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) return next();

  console.error(err);
  res.sendStatus(500);
}