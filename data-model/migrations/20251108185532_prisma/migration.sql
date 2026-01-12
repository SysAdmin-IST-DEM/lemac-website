/*
  Warnings:

  - You are about to drop the `monitor_hours_targets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notes` table. If the table is not empty, all the data it contains will be lost.
  - Delete orphaned data from the `room_events` table.

*/

-- DeleteOrphanedData
DELETE re
FROM room_events AS re
WHERE re.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM users AS u
    WHERE u.user_id = re.user_id
  );

-- DropForeignKey
ALTER TABLE `entries` DROP FOREIGN KEY `entries_ibfk_1`;

-- DropForeignKey
ALTER TABLE `log_hours` DROP FOREIGN KEY `log_hours_ibfk_1`;

-- DropForeignKey
ALTER TABLE `monitor_schedule` DROP FOREIGN KEY `monitor_schedule_ibfk_1`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_ibfk_1`;

-- DropForeignKey
ALTER TABLE `room_hours` DROP FOREIGN KEY `room_hours_ibfk_1`;

-- AlterTable
ALTER TABLE `room_events` ALTER COLUMN `observations` DROP DEFAULT;

-- DropTable
DROP TABLE `monitor_hours_targets`;

-- DropTable
DROP TABLE `notes`;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `entries_workstation_id_fkey` FOREIGN KEY (`workstation_id`) REFERENCES `workstations`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `log_hours` ADD CONSTRAINT `log_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monitor_schedule` ADD CONSTRAINT `monitor_schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monitor_targets` ADD CONSTRAINT `monitor_targets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_hours` ADD CONSTRAINT `room_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- RedefineIndex
CREATE INDEX `entries_workstation_id_idx` ON `entries`(`workstation_id`);

-- RedefineIndex
CREATE INDEX `log_hours_user_id_idx` ON `log_hours`(`user_id`);

-- RedefineIndex
CREATE INDEX `monitor_schedule_user_id_idx` ON `monitor_schedule`(`user_id`);

-- RedefineIndex
CREATE INDEX `room_hours_user_id_idx` ON `room_hours`(`user_id`);

-- RedefineIndex
CREATE UNIQUE INDEX `users_ist_id_key` ON `users`(`ist_id`);
