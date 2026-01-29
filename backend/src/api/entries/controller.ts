import { prisma } from '../../index.js';
import { Prisma } from '@lemac/data-model';

export async function addEntry(istId: string, workstationId: number) {
  return prisma.$transaction(async (tx) => {
    await tx.workstation.update({
      where: { id: workstationId },
      data: { occupation: { increment: 1 } },
    });

    return tx.entry.create({
      data: { istId, workstationId },
      include: { workstation: true },
    });
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
        closedAt: new Date(),
        workstation: {
          update: {
            occupation: {
              decrement: 1
            }
          }
        }
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

export async function getEntry(entryId: number) {
  return prisma.entry.findUnique({
    where: { id: entryId },
    include: { workstation: true }
  });
}