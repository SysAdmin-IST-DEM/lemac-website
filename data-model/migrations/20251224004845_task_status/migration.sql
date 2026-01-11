/*
  Warnings:

  - You are about to drop the column `resolved_at` on the `print_tasks` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `print_tasks` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `print_tasks` DROP COLUMN `resolved_at`,
    ADD COLUMN `completed_at` TIMESTAMP(0) NULL,
    MODIFY `status` ENUM('PENDING', 'IN_QUEUE', 'PRINTING', 'COMPLETED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
