/*
  Warnings:

  - You are about to drop the column `model_file` on the `print_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `print_tasks` DROP COLUMN `model_file`,
    ADD COLUMN `model_files` JSON NOT NULL;
