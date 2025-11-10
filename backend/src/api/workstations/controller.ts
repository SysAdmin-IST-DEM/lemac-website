import type { Workstation } from '@prisma/client';
import { prisma } from '../../index.js';
import { Prisma } from '@prisma/client';

export async function addWorkstation(workstation: Workstation) {
  try {
    return prisma.workstation.create({
      data: workstation,
    })
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return 'ER_DUP_ENTRY';
    throw e;
  }
}

export async function getWorkstations() {
  return prisma.workstation.findMany();
}

export async function updateWorkstation(id: number, workstation: Workstation) {
  try {
    console.log(JSON.stringify(workstation.softwares));

    workstation.softwares = JSON.stringify(workstation.softwares);
    workstation.problems = JSON.stringify(workstation.problems);

    return await prisma.workstation.update({
      data: workstation,
      where: { id },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function deleteWorkstation(id: number) {
  try {
    return await prisma.workstation.delete({
      where: { id }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

export async function checkWorkstation(id: number) {
  const workstation = await prisma.workstation.findUnique({ where: { id } });
  if (!workstation) return false;
  return workstation.occupation < workstation.capacity;
}

export async function changeOccupation(id: number, change: number) {
  try {
    return await prisma.workstation.update({
      where: { id },
      data: {
        occupation: {
          increment: change,
        }
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}