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
  let filter = undefined;
  if(onlyNegative) filter = {
    amount: {
      _sum: { lt: 0 }
    }
  }

  // TODO: Improve this

  const result = await prisma.studentTransaction.groupBy({
    by: ['studentId'],
    _sum: { amount: true },
    having: filter,
  });

  const studentIds = result.map(item => item.studentId);

  const students = await prisma.student.findMany({
    where: {
      id: { in: studentIds },
    },
  });

  const studentMap = new Map(students.map(s => [s.id, s]));

  return result.map(d => ({
    studentId: d.studentId,
    balance: d._sum.amount,
    student: studentMap.get(d.studentId)
  }));
}