import multer from 'multer'
import type { Express } from 'express';
import path from 'path'

import { addPrintingTask, dowloadModelFile, getPrintTasks, updatePrintingTask } from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';
import { AddPrintTaskBody, EditPrintTaskBody } from '@lemac/data-model';
import { parseBody } from '../../middleware/parseBody.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, },
  fileFilter: (req, file, cb) => {
    const allowedExt = [".stl", ".obj", ".3mf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) cb(new Error("Only 3D model files are allowed"));
    cb(null, true);
  }
})

export default {
  init: (app: Express) => {
    app.get('/api/printing/uploads/:filename', requiresAuth(), dowloadModelFile);
    app.post('/api/printing', upload.single('modelFile'), parseBody(AddPrintTaskBody), addPrintingTask);
    app.get('/api/printing', requiresAuth(1), getPrintTasks);
    app.put('/api/printing/:id', requiresAuth(1), parseBody(EditPrintTaskBody), updatePrintingTask);
    /*app.delete('/api/publication/:id', requiresAuth(1), deletePublication);*/
  },
};
