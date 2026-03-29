import { prisma } from '../../index.js';
import { type EntrySource, Prisma } from '@lemac/data-model';

export async function addEntry(istId: string, workstationId: number, source?: EntrySource) {
  return prisma.$transaction(async (tx) => {
    await tx.workstation.update({
      where: { id: workstationId },
      data: { occupation: { increment: 1 } },
    });

    return tx.entry.create({
      data: { istId, workstationId, source },
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

export async function getEntries(active = false, orderBy?: Prisma.EntryOrderByWithRelationInput[], page: number = 0, itemsPerPage?: number) {
  // if not active then all entries will be shown (there is no extra query), if active only active entries will be shown
  if(active) {
    return Promise.all([
      prisma.entry.findMany({
        where: { active: true },
        include: { workstation: true },
        orderBy,
        skip: itemsPerPage ? (page - 1) * itemsPerPage : undefined,
        take: itemsPerPage
      }),
      prisma.entry.count({
        where: { active: true },
      })
    ]);
  } else {
    return Promise.all([
      prisma.entry.findMany({
        include: { workstation: true },
        orderBy,
        skip: itemsPerPage ? (page - 1) * itemsPerPage : undefined,
        take: itemsPerPage
      }),
      prisma.entry.count()
    ]);
  }
}

export async function getEntry(entryId: number) {
  return prisma.entry.findUnique({
    where: { id: entryId },
    include: { workstation: true }
  });
}