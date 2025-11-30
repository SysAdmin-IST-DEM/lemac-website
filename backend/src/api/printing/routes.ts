import type { Express } from 'express';

import {
  addPrintingTask,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/printing', requiresAuth(1), addPrintingTask);
    app.get('/api/publication', getPublications);
    app.put('/api/publication/:id', requiresAuth(1), updatePublications);
    app.delete('/api/publication/:id', requiresAuth(1), deletePublication);
  },
};
