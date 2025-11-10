import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

export async function addEntry(istId: string, workstationId: number) {
  return prisma.entry.create({
    data: {
      istId, workstationId
    },
    include: {
      workstation: true
    }
  });
}

export async function updateEntryObservation(entryId: number, observation: string, worksationId: number, istId: string) {
  try {
    return await prisma.entry.update({
      where: {
        id: entryId
      },
      data: {
        observations: observation,
        workstationId: worksationId,
        istId: istId
      },
      include: {
        workstation: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function closeEntry(entryId: number) {
  try {
    return await prisma.entry.update({
      where: {
        id: entryId
      },
      data: {
        active: false,
        closedAt: new Date()
      },
      include: {
        workstation: true
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function getEntries(active = false) {
  // if not active then all entries will be shown (there is no extra query), if active only active entries will be shown
  if(active) {
    return prisma.entry.findMany({
      where: { active: true },
      include: { workstation: true }
    });
  } else {
    return prisma.entry.findMany({ include: { workstation: true } });
  }
}

export async function deleteEntry(entryId: number) {
  const { count } = await prisma.entry.deleteMany({
    where: { id: entryId }
  });
  return count !== 0;
}

export async function getEntry(entryId: number) {
  return prisma.entry.findUnique({
    where: { id: entryId },
    include: { workstation: true }
  });
}