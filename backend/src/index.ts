import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/requestHandler.js';
import { verifyMiddleware } from './middleware/verifier.js';

import api from './api/index.js';

import { PrismaClient } from '@lemac/data-model'
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ensureBucket } from './services/minio.js';

/* Convert BigInt to String in JSON */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/* Setup Database Client */
if(!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error("Database environment variables are not properly set.");
}

const mysqlAdapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT!) || 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter: mysqlAdapter })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
await ensureBucket();

/* Start Server */
app.listen(port, () => {
  console.log(`lemac-backend listening on http://localhost:${port}`);
});