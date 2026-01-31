import { prisma } from '../../index.js';
import type { Entry, Student } from '@lemac/data-model';
import { DateTime } from 'luxon';

export enum OnScanCardResultCode {
  STUDENT_NOT_FOUND = "STUDENT_NOT_FOUND",
  STUDENT_REQUIRES_RENEWAL = "STUDENT_REQUIRES_RENEWAL",
  NO_ACTIVE_ENTRY = "NO_ACTIVE_ENTRY",
  ACTIVE_ENTRY_FOUND = "ACTIVE_ENTRY_FOUND"
}

export async function getActiveEntry(mifareNumber: string): Promise<{
  ok: boolean;
  code: OnScanCardResultCode;
  student?: Student,
  entry?: Entry
}> {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { mifareNumber }
    });

    if (!student) {
      return {
        ok: false,
        code: OnScanCardResultCode.STUDENT_NOT_FOUND
      };
    }

    const requiresRenewal = DateTime.fromJSDate(student.lastRenewed) < DateTime.fromObject(
      { year: DateTime.now().year, month: 9, day: 1 });

    if(requiresRenewal) {
      return {
        ok: false,
        code: OnScanCardResultCode.STUDENT_REQUIRES_RENEWAL
      }
    }

    const activeEntry = await tx.entry.findFirst({
      where: { istId: student.istId, active: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeEntry) {
      return {
        ok: true,
        code: OnScanCardResultCode.NO_ACTIVE_ENTRY,
        student,
      };
    }

    return {
      ok: true,
      code: OnScanCardResultCode.ACTIVE_ENTRY_FOUND,
      entry: activeEntry,
      student,
    };
  });
}