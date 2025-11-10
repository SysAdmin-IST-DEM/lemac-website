import type { RoomEventType } from '@prisma/client';
import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

export async function createEvent(type: RoomEventType, userId: number, roomReservationId: number) {
  return prisma.roomEvent.create({
    data: {
      type, userId, roomReservationId
    }
  });
}

export async function getEvents(start: Date, finish: Date) {
  return prisma.roomEvent.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: finish
      }
    },
    include: {
      user: true,
      roomReservation: true
    }
  });
}

export async function editEvent(type: RoomEventType, id: number, roomReservationId: number, observations: string) {
  try {
    return await prisma.roomEvent.update({
      data: {
        type,
        roomReservationId,
        observations
      },
      where: {
        id
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function deleteEvents(id: number) {
  try {
    return await prisma.roomEvent.delete({
      where: { id }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}