import type { Express } from 'express';

import { addEntry, deleteEntry, updateEntry, getEntries } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/entries', requiresAuth(), addEntry);
    app.delete('/api/entries/:id', requiresAuth(), deleteEntry);
    app.put('/api/entries/:id', requiresAuth(), updateEntry);
    app.get('/api/entries', requiresAuth(), getEntries);
  },
};
