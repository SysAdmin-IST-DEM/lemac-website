import { prisma } from '../../index.js';

export async function upsertStudent(istId: string, name: string, email: string,
                                       mifareNumber: bigint) {
  const student = await prisma.student.upsert({
    where: { istId },
    create: {
      istId,
      name,
      email,
    },
    update: {
      name,
      email,
      lastRenewed: new Date()
    }
  });

  await prisma.studentCard.upsert({
    where: { mifareNumber },
    create: {
      mifareNumber,
      studentId: student.id
    },
    update: {
      studentId: student.id,
      lastModified: new Date()
    }
  })

  return student;
}