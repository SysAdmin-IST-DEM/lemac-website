import type { Express } from 'express';

import {
  addPrintingMaterial,
  updatePrintingMaterial,
  deletePrintingMaterial,
  getPrintingMaterials,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';
import { parseBody } from '../../middleware/parseBody.js';
import { AddPrintMaterialBody, EditPrintMaterialBody } from '@lemac/data-model';

export default {
  init: (app: Express) => {
    app.post('/api/print-materials', requiresAuth(1), parseBody(AddPrintMaterialBody), addPrintingMaterial);
    app.get('/api/print-materials', requiresAuth(1), getPrintingMaterials);
    app.put('/api/print-materials/:id', requiresAuth(1), parseBody(EditPrintMaterialBody), updatePrintingMaterial);
    app.delete('/api/print-materials/:id', requiresAuth(1), deletePrintingMaterial);
  },
};
