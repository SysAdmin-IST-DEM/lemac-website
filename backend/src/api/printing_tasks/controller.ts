import { prisma } from '../../index.js';
import type { Unit } from '@lemac/data-model';

export async function addPrintTask(name: string, modelFile: string, amount: number, istId: string,
                                   email: string, unit: Unit, materialId: number) {
  return prisma.printTask.create({
    data: {
      name,
      modelFile,
      amount,
      istId,
      email,
      unit,
      price: 0,
      material: {
        connect: {
          id: materialId
        }
      }
    }
  });
}