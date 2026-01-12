import type { Express } from 'express';

import { addUser, getUsers, updateUser, deleteUser } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/users', requiresAuth(1), addUser);
    app.get('/api/users', requiresAuth(), getUsers);
    app.put('/api/users/:id', requiresAuth(1), updateUser);
    app.delete('/api/users/:id', requiresAuth(1), deleteUser);
  },
};
