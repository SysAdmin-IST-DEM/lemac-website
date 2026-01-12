import type { Express } from 'express';

import {
  addPublication,
  deletePublication,
  updatePublications,
  getPublications,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/publication', requiresAuth(1), addPublication);
    app.get('/api/publication', getPublications);
    app.put('/api/publication/:id', requiresAuth(1), updatePublications);
    app.delete('/api/publication/:id', requiresAuth(1), deletePublication);
  },
};
