/*
  Warnings:

  - You are about to alter the column `mifare_number` on the `students` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `students` MODIFY `mifare_number` INTEGER NOT NULL;
