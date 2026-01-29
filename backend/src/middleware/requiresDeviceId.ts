import type { NextFunction, Request, Response } from 'express';

export function requiresDeviceId(req: Request, res: Response, next: NextFunction) {
  const deviceId = req.header("X-Device-Id");
  const auth = req.header("Authorization") || "";

  if (!deviceId) return res.status(401).json({ error: "Missing X-Device-Id" });
  if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing Bearer token" });

  const token = auth.slice("Bearer ".length).trim();

  if (!process.env.CARD_READER_AUTH || token !== process.env.CARD_READER_AUTH) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}