import type { Express } from 'express';
import { assignStudentCard, fenixCallback, getStudents } from './index.js';
import { AssignStudentCardBody } from '@lemac/data-model';
import { parseBody } from '../../middleware/parseBody.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';

export default {
  init: (app: Express) => {
    app.get('/api/students', requiresAuth(), getStudents);
    app.post('/api/students/assign-card', requiresAuth(), parseBody(AssignStudentCardBody), assignStudentCard);
    app.get('/api/student/fenix-callback', fenixCallback);
  },
};