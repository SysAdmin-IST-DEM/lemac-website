-- DropForeignKey
ALTER TABLE `room_events` DROP FOREIGN KEY `room_events_room_data_id_fkey`;

-- DropIndex
DROP INDEX `room_events_room_data_id_fkey` ON `room_events`;

-- AlterTable
ALTER TABLE `room_events` MODIFY `room_data_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_room_data_id_fkey` FOREIGN KEY (`room_data_id`) REFERENCES `room_hours`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
