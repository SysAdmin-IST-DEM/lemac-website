import type { Express } from 'express';

import { loginFenix, userProfile, getFenixData } from './index.js';

export default {
  init: (app: Express) => {
    app.get('/api/auth/fenix', loginFenix);
    app.get('/api/auth/profile', userProfile);
    app.get('/api/auth/fenix_info', getFenixData);
  },
};
