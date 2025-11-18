import type { Express } from 'express';

import {
  addHours,
  getHours,
  getIndividualHours,
  deleteHours,
  updateHours,
  getSum,
  lastEntry,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/loghours', requiresAuth(), addHours);
    app.get('/api/loghours', requiresAuth(1), getHours);
    app.get('/api/loghours/self', requiresAuth(), getIndividualHours);
    app.put('/api/loghours/:id', requiresAuth(), updateHours);
    app.delete('/api/loghours/:id', requiresAuth(), deleteHours);
    app.get('/api/loghours/sum', requiresAuth(1), getSum);
    app.get('/api/loghours/lastEntry', requiresAuth(), lastEntry);
  },
};
