import multer from 'multer'
import type { Express } from 'express';
import path from 'path'

import {
  addPrintingTask,
} from './index.js';
import { requiresAuth } from '../../middleware/requiresAuth.js';
import { AddPrintTaskBody } from '@lemac/data-model';
import { parseBody } from '../../middleware/parseBody.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR!);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // optional: normalize base name, remove weird chars
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");

    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedExt = [".stl", ".obj", ".3mf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(ext)) {
      return cb(new Error("Only 3D model files are allowed"));
    }

    cb(null, true);
  }
})

export default {
  init: (app: Express) => {
    app.post('/api/printing', upload.single('modelFile'), parseBody(AddPrintTaskBody), addPrintingTask);
    /*app.get('/api/publication', getPublications);
    app.put('/api/publication/:id', requiresAuth(1), updatePublications);
    app.delete('/api/publication/:id', requiresAuth(1), deletePublication);*/
  },
};
