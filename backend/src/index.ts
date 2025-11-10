import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { errorHandler } from './middleware/requestHandler.js';
import { verifyMiddleware } from './middleware/verifier.js';

import api from './api/index.js';

import { PrismaClient } from '@prisma/client'

/* Setup Database Client */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma =
  globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/* Enables CORS in dev server */
var corsOptions = {
  origin: process.env.URL,
}
console.log(corsOptions.origin);

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

/* Start Server */
const server = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

/* Handle WebSocket Upgrades */
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
