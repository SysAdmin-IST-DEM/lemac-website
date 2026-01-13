import type { RequestHandler } from 'express';

export function requiresAuth(minRole = 0): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log("RECEIVED REQ.USER:", req.user, " with admin:", req.user.admin, " and minRole:", minRole);

    const role = req.user.admin ? 1 : 0;

    return role >= minRole ? next() : res.status(403).json({ error: 'Forbidden' });
  }
}