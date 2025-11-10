import type { Express } from 'express';

import {
  addWorkstation,
  getWorkstations,
  updateWorkstation,
  deleteWorkstation,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/workstations', requiresAuth(1), addWorkstation);
    app.get('/api/workstations', getWorkstations);
    app.put('/api/workstations/:id', requiresAuth(), updateWorkstation);
    app.delete('/api/workstations/:id', requiresAuth(1), deleteWorkstation);
  },
};