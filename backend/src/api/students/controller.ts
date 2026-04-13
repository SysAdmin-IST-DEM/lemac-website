import { prisma } from '../../index.js';

export async function getAllStudents() {
  return prisma.student.findMany();
}

export async function addStudentCard(studentId: number, mifareNumber: bigint) {
  return prisma.studentCard.upsert({
    where: { mifareNumber },
    create: {
      mifareNumber,
      studentId
    },
    update: {
      studentId,
      lastModified: new Date()
    }
  })
}

export async function upsertStudent(istId: string, name: string, email: string,
                                       mifareNumber: bigint | null) {
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

  if(mifareNumber) {
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
  }

  return student;
}