import { prisma } from '../../index.js';

export async function upsertStudent(istId: string, name: string, email: string,
                                       mifareNumber: string) {
  return prisma.student.upsert({
    where: { istId },
    create: {
      istId,
      name,
      email,
      mifareNumber
    },
    update: {
      name,
      email,
      mifareNumber,
      lastRenewed: new Date()
    }
  });
}