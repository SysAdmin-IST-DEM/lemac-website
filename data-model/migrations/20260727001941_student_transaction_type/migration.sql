/*
  Warnings:

  - Added the required column `type` to the `student_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_transactions` ADD COLUMN `type` ENUM('CHARGE', 'PAYMENT', 'ADJUSTMENT') NOT NULL;
