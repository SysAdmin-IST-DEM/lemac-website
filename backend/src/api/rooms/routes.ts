import type { Express } from 'express';

import { getHoursFenix, getHours, addHours, deleteHours, updateHours } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.post('/api/room-hours/fenix', getHoursFenix);
    app.get('/api/room-hours', getHours);
    app.post('/api/room-hours', requiresAuth(), addHours);
    app.delete('/api/room-hours/:id', requiresAuth(), deleteHours);
    app.put('/api/room-hours/:id', requiresAuth(), updateHours);
  },
};