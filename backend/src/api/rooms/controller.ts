import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

import * as services from './services.js';

export async function getHoursFenix(roomId: number, date: string) {
  return await services.getRoomData(roomId, date);
}

export async function getHours(month: number, year: number) {
  return prisma.roomReservation.findMany({
    where: {
      entry: {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month,     1))
      },
      deleted: false,
    },
    include: {
      user: true
    }
  });
}

export async function addHours(hours: {entry: string, exit: string}, userId: number, room: string, name: string, istId: string) {
  return prisma.roomReservation.create({
    data: {
      entry: new Date(hours.entry),
      exit: new Date(hours.exit),
      userId: userId,
      room: room,
      name,
      istId
    },
    include: {
      user: true
    }
  });
}

export async function deleteHours(id: number) {
  try {
    return await prisma.roomReservation.update({
      where: { id },
      data: {
        deleted: true
      },
      include: {
        user: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function updateHours(hours: {entry: string, exit: string}, id: number, userId: number, room: string, name: string, istId: string, givenKey: boolean) {
  try {
    return await prisma.roomReservation.update({
      where: { id },
      data: {
        entry: new Date(hours.entry),
        exit: new Date(hours.exit),
        userId,
        room,
        name,
        istId,
        givenKey
      },
      include: {
        user: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}