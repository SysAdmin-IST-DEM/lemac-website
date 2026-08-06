import { prisma } from '../../index.js';
import { Prisma, type StudentTransactionType } from '@lemac/data-model';

export async function addStudentTransaction(type: StudentTransactionType, amount: number, studentId: number,
                                            printTaskId?: number, tx?: Prisma.TransactionClient) {
  let printTaskObj = {}
  if(printTaskId !== undefined) printTaskObj = {
    connect: {
      id: printTaskId,
    }
  }

  return (tx || prisma).studentTransaction.create({
    data: {
      type,
      student: {
        connect: {
          id: studentId,
        }
      },
      amount,
      printTask: printTaskObj
    },
    include: {
      student: true,
      printTask: true
    }
  })
}

export async function getSumStudentTransactions(studentId: number) {
  const result = await prisma.studentTransaction.aggregate({
    where: { studentId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

export async function getAllSumStudentsTransactions(onlyNegative: boolean) {
  let filter = {};
  if(onlyNegative) filter = { lt: 0 };

  const result = await prisma.studentTransaction.groupBy({
    by: ['studentId'],
    _sum: { amount: true },
    having: {
      amount: {
        _sum: filter
      }
    }
  });

  return result.map(d => ({
    studentId: d.studentId,
    balance: Math.abs(d._sum.amount ?? 0),
  }));
}