/*
  Warnings:

  - Added the required column `student_name` to the `print_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `print_tasks` ADD COLUMN `student_name` VARCHAR(255) NOT NULL;
