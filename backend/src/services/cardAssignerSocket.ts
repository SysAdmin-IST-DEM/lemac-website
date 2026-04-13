import type { Server as HTTPServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import type { CorsOptions } from 'cors';

let io: SocketIOServer;
const pendingAssignments = new Map<string, string>();

export const initCardAssignerSocket = (server: HTTPServer, corsOptions: CorsOptions)=> {
  io = new SocketIOServer(server, {
    cors: corsOptions
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