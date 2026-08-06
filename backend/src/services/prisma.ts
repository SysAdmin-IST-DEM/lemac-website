import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@lemac/data-model';

export function initPrisma() {
  if(!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error("Database environment variables are not properly set.");
  }

  const mysqlAdapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT!) || 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

  const prisma = globalForPrisma.prisma || new PrismaClient({ adapter: mysqlAdapter })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

  return prisma
}