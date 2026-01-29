import type { Express } from 'express';

import { addEntry, updateEntry, getEntries } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/entries', requiresAuth(), addEntry);
    app.put('/api/entries/:id', requiresAuth(), updateEntry);
    app.get('/api/entries', requiresAuth(), getEntries);
  },
};
