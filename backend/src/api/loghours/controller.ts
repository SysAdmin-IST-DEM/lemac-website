import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

function getTime(entry: string, exit: string) {
  //2021-10-23T05:30:00.000Z
  const timeIn = parseInt(entry.slice(11, 13), 10) * 60 + parseInt(entry.slice(14, 16), 10);
  const timeOut = parseInt(exit.slice(11, 13), 10) * 60 + parseInt(exit.slice(14, 16), 10);

  return timeOut - timeIn;
}

export async function addHours(hours: {entry: string, exit: string}, userId: number, entryNumber: number, exitNumber: number, safeAmount: number) {
  return prisma.logHour.create({
    data: {
      userId,
      entry: hours.entry,
      exit: hours.exit,
      time: getTime(hours.entry, hours.exit),
      entryNumber,
      exitNumber,
      safeAmount
    },
    include: {
      user: true
    }
  });
}

export async function getHours(month: number, year: number) {
  console.log(month, year);
  if (month === -1) {
    return prisma.logHour.findMany({
      include: {
        user: true
      }
    });
  } else {
    return prisma.logHour.findMany({
      where: {
        entry: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month,     1))
        }
      },
      include: {
        user: true
      }
    });
  }
}

export async function getIndividualHours(userId: number) {
  return prisma.logHour.findMany({
    where: {
      userId
    },
    include: {
      user: true
    }
  });
}

export async function updateHours(hours: {entry: string, exit: string}, id: number, userId: number, entryNumber: number, exitNumber: number, safeAmount: number) {
  try {
    return await prisma.logHour.update({
      where: { id },
      data: {
        entry: hours.entry,
        exit: hours.exit,
        time: getTime(hours.entry, hours.exit),
        entryNumber,
        exitNumber,
        safeAmount,
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

export async function deleteHours(id: number, userId: number) {
  const { count } = await prisma.logHour.deleteMany({
    where: {
      id,
      userId
    }
  });

  return count > 0;
}

export async function getSum(start: string, finish: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${finish}T00:00:00`);
  endDate.setDate(endDate.getDate() + 1);

  // 1) Sum log hours per user
  const grouped = await prisma.logHour.groupBy({
    by: ['userId'],
    where: {
      entry: { gte: startDate, lt: endDate },
    },
    _sum: { time: true },
  });

  // 2) Fetch names for those users
  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map(g => g.userId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(users.map(u => [u.id, u.name]));

  // 3) Merge
  return grouped.map(g => ({
    id: g.userId,
    name: nameById.get(g.userId) ?? null, // matches LEFT JOIN behavior
    time: g._sum.time ?? 0,
  }));
}

export async function lastEntry() {
  try {
    return await prisma.logHour.findFirst({
      orderBy: {
        id: 'desc'
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}