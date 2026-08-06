import { StudentTransactionType, type Unit } from '@lemac/data-model';
import { addPrintTask } from './controller.js';
import { addStudentTransaction } from '../student_transactions/controller.js';
import { prisma } from '../../index.js';

export async function addPrintTaskAndTransaction(name: string, modelFile: string, amount: number, istId: string,
  unit: Unit, materialId: number, price: number, observations?: string) {

  return prisma.$transaction(async (tx) => {
    const task = await addPrintTask(
      name,
      modelFile,
      amount,
      istId,
      unit,
      materialId,
      price,
      observations,
      tx
    )

    await addStudentTransaction(
      StudentTransactionType.CHARGE,
      -Math.abs(price),
      task.student.id,
      task.id,
      tx
    )

    return task;
  })
}