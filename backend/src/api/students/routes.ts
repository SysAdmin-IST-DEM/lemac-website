import type { Express } from 'express';
import { fenixCallback } from './index.js';

export default {
  init: (app: Express) => {
    app.get('/api/student/fenix-callback', fenixCallback);
  },
};