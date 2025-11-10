import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

export async function createEvent(entry: string, exit: string, userId: number) {
  return prisma.monitorSchedule.create({
    data: {
      userId,
      entry,
      exit
    },
    include: {
      user: true
    }
  });
}

export async function getEvents() {
  return prisma.monitorSchedule.findMany({
    include: { user: true }
  });
}

export async function editEvent(entry: string, exit: string, userId: number, id: number) {
  try {
    return await prisma.monitorSchedule.update({
      where: { id },
      data: {
        entry,
        exit,
        userId
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

export async function deleteEvents(id: number) {
  try {
    return await prisma.monitorSchedule.delete({
      where: { id },
      include: {
        user: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function getUserTargets() {
  return prisma.monitorTarget.findMany({
    include: { user: true }
  });
}

export async function setUserTargets(targetHours: number, dateStart: string, dateEnd: string, userId: number) {
  return prisma.monitorTarget.create({
    data: {
      targetHours,
      dateStart,
      dateEnd,
      userId
    },
    include: {
      user: true
    }
  });
}

export async function editUserTargets(targetHours: number, dateStart: string, dateEnd: string, id: number) {
  try {
    return await prisma.monitorTarget.update({
      where: { id },
      data: {
        targetHours,
        dateStart,
        dateEnd
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

export async function deleteTarget(id: number) {
  try {
    return await prisma.monitorTarget.delete({
      where: { id},
      include: {
        user: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function getOffDays() {
  return prisma.offDay.findMany({});
}

export async function setOffDays(date: string) {
  const existing = await prisma.offDay.findFirst({
    where: { date },
  });
  if (existing) return existing;

  return prisma.offDay.create({
    data: { date },
  });
}

export async function deleteOffDay(id: number) {
  try {
    return await prisma.offDay.delete({
      where: { id }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}