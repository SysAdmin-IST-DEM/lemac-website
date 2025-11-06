export function requiresAuth(minRole = 0) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let admin = req.user.admin;
    if (!Number.isFinite(admin)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return admin >= minRole ? next() : res.status(403).json({ error: 'Forbidden' });
  }
}