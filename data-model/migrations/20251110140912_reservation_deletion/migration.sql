/*
  Warnings:

  - Made the column `room_data_id` on table `room_events` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `room_events` DROP FOREIGN KEY `room_events_room_data_id_fkey`;

-- DropIndex
DROP INDEX `room_events_room_data_id_fkey` ON `room_events`;

-- AlterTable
ALTER TABLE `room_events` MODIFY `room_data_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `room_hours` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_room_data_id_fkey` FOREIGN KEY (`room_data_id`) REFERENCES `room_hours`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
