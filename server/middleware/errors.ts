import { NextFunction, Request, Response } from 'express';

export function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled API error', error);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Internal server error' });
}
