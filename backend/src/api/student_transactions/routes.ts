import type { Express } from 'express';

import { requiresAuth } from '../../middleware/requiresAuth.js';
import { getStudentBalance, getAllStudentsBalances, addStudentTransaction } from './index.js';
import { parseBody } from '../../middleware/parseBody.js';
import { AddStudentTransactionBody } from '@lemac/data-model';

export default {
  init: (app: Express) => {
    app.get('/api/student-balances/:id', requiresAuth(), getStudentBalance);
    app.get('/api/student-balances/', requiresAuth(), getAllStudentsBalances);
    app.post('/api/student-transaction', requiresAuth(),  parseBody(AddStudentTransactionBody), addStudentTransaction);
  },
};