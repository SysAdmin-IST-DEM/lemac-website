import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/requestHandler.js';
import { verifyMiddleware } from './middleware/verifier.js';

import api from './api/index.js';

import { ensureBucket } from './services/minio.js';
import * as http from 'node:http';
import { initCardAssignerSocket } from './services/cardAssignerSocket.js';
import { initPrisma } from './services/prisma.js';

/* Convert BigInt to String in JSON */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/* Setup Database Client */
export const prisma = initPrisma();

/* Enables CORS in dev server */
const corsOptions = {
  origin: process.env.URL,
}

/* Setup Express Server */
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors(corsOptions));
// TODO: app.use(dbMiddleware);
app.use(errorHandler);
app.use(verifyMiddleware);

/* Initialize API routes */
api.init(app);

/* Start MINIO service */
ensureBucket().catch((err) => {
  console.error('Failed to initialize MinIO bucket:', err);
});

const server = http.createServer(app);

/* Init Card Assigner Websocket */
initCardAssignerSocket(server, corsOptions);

/* Start Server */
server.listen(port, () => {
  console.log(`lemac-backend listening on http://localhost:${port}`);
});