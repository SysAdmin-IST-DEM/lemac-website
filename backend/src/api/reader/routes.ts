import type { Express } from 'express';
import { parseBody } from '../../middleware/parseBody.js';
import { addEntry, closeEntry, getActiveEntry } from './index.js';
import { AddEntryBody, GetActiveEntryBody } from '@lemac/data-model';
import { requiresDeviceId } from '../../middleware/requiresDeviceId.js';

export default {
  init: (app: Express) => {
    app.get('/api/reader/active-entry', requiresDeviceId, parseBody(GetActiveEntryBody), getActiveEntry);
    app.post('/api/reader/add-entry', requiresDeviceId, parseBody(AddEntryBody), addEntry);
    app.put('/api/reader/close-entry/:id', requiresDeviceId, closeEntry);
  },
};
