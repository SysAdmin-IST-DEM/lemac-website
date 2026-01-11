import type * as Prisma from './generated/prisma/internal/prismaNamespace.js';

export * from './generated/prisma/browser.js';
export type * from './http/index.js';

export type PrintTask = Prisma.PrintTaskGetPayload<{ include: { material: true, assigned: true } }>;