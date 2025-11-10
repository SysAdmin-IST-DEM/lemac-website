import type { Express } from 'express';

import { createEvent, editEvent, getEvents, deleteEvents } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.get('/api/room-events', requiresAuth(), getEvents);
    app.post('/api/room-events', requiresAuth(), createEvent);
    app.put('/api/room-events/:id', requiresAuth(), editEvent);
    app.delete('/api/room-events/:id', requiresAuth(1), deleteEvents);
  }
};
