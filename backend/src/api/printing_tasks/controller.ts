import { prisma } from '../../index.js';
import type { PrintTaskStatus, Unit } from '@lemac/data-model';

export async function addPrintTask(name: string, modelFile: string, amount: number, studentName: string, studentId: string,
                                   email: string, unit: Unit, materialId: number, price: number, observations?: string) {
  return prisma.printTask.create({
    data: {
      name,
      modelFiles: [ modelFile ],
      amount,
      studentName,
      studentId,
      email,
      unit,
      price,
      observations,
      material: {
        connect: {
          id: materialId
        }
      }
    },
    include: {
      material: true
    }
  });
}

export async function getPrintingTasks() {
  return prisma.printTask.findMany({
    include: {
      material: true,
      assigned: true
    }
  });
}

export async function editPrintingTask(id: number, name?: string, materialId?: number,
                                       status?: PrintTaskStatus, amount?: number, studentName?: string,
                                       studentId?: string, email?: string, unit?: Unit,
                                       price?: number, deadline?: Date | null,
                                       observations?: string, assignedId?: number,
                                       completedAt?: Date | null) {
  return prisma.printTask.update({
    where: {
      id
    },
    data: {
      name,
      status,
      amount,
      studentName,
      studentId,
      email,
      unit,
      price,
      deadline,
      observations,
      completedAt,
      material: materialId ? {
        connect: {
          id: materialId
        }
      } : undefined,
      assigned: assignedId ? {
        connect: {
          id: assignedId
        }
      } : undefined
    },
    include: {
      material: true,
      assigned: true
    }
  });
}