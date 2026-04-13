import type { Server as HTTPServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import type { CorsOptions } from 'cors';
import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken';
import { isJwtUser } from '../middleware/verifier.js';

let io: SocketIOServer;
const pendingAssignments = new Map<string, string>();

export const initCardAssignerSocket = (server: HTTPServer, corsOptions: CorsOptions)=> {
  io = new SocketIOServer(server, {
    path: "/api",
    cors: corsOptions
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.error("Card Websocket. Authentication error: Token missing")
      return next(new Error('Authentication error: Token missing'));
    }

    jwt.verify(token!, process.env.JWT_SECRET!, (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (!err && isJwtUser(user) && user.active) {
        return next();
      }
      console.error("Card Websocket. Authentication error: Token invalid");
      return next(new Error('Authentication error: Token invalid'));
    });
  });

  io.on('connection', (socket) => {
    socket.on('start-assigning', (data) => {
      pendingAssignments.set(socket.id, data.studentId);
      console.log(`Socket ${socket.id} is now waiting for card for student ${data.studentId}`);
    });

    socket.on('stop-assigning', () => {
      pendingAssignments.delete(socket.id);
      console.log(`Socket ${socket.id} is now no longer waiting.`);
    });

    socket.on('disconnect', () => pendingAssignments.delete(socket.id));
  });
}

export const emitCardScanned = (mifareNumber: bigint) => {
  if(pendingAssignments.size > 0) {
    io.emit('card-scanned', { mifareNumber });
    return true;
  } else {
    return false;
  }
}