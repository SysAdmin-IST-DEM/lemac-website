import type { Express } from 'express';

import {
  createEvent,
  editEvent,
  getEvents,
  deleteEvents,
  getUserTargets,
  setUserTarget,
  getOffDays,
  setOffDay,
  deleteOffDay,
  editUserTarget,
  deleteTarget,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.get('/api/schedule', requiresAuth(), getEvents);
    app.post('/api/schedule', requiresAuth(), createEvent);
    app.put('/api/schedule/:id', requiresAuth(), editEvent);
    app.delete('/api/schedule/:id', requiresAuth(), deleteEvents);
    app.post('/api/schedule/targets', requiresAuth(1), setUserTarget);
    app.put('/api/schedule/targets/:id', requiresAuth(1), editUserTarget);
    app.delete('/api/schedule/targets/:id', requiresAuth(1), deleteTarget);
    app.get('/api/schedule/targets', requiresAuth(), getUserTargets);
    app.get('/api/schedule/off_days', requiresAuth(), getOffDays);
    app.post('/api/schedule/off_days', requiresAuth(1), setOffDay);
    app.delete('/api/schedule/off_days/:id', requiresAuth(1), deleteOffDay);
  },
};