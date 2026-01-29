import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { errorHandler } from './middleware/requestHandler.js';
import { verifyMiddleware } from './middleware/verifier.js';

import api from './api/index.js';

import { PrismaClient } from '@lemac/data-model'
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ensureBucket } from './services/minio.js';

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

/* Setup WebSocket Server */
const wsServer = new WebSocketServer({ noServer: true });

wsServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    if (message.toString() === 'ping') {
      socket.send('pong');
      return;
    }

    console.log(message.toString());
  });
  socket.on('close', (e) => console.log(e.toString()));
  socket.on('error', (e) => console.error(e.toString()));
});

/* Initialize API routes */
api.init(app, wsServer);

/* Start MINIO service */
await ensureBucket();

/* Start Server */
const server = app.listen(port, () => {
  console.log(`lemac-backend listening on http://localhost:${port}`);
});

/* Handle WebSocket Upgrades */
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
