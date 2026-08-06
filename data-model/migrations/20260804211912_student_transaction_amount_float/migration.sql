/*
  Warnings:

  - You are about to alter the column `amount` on the `student_transactions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `student_transactions` MODIFY `amount` DOUBLE NOT NULL;
