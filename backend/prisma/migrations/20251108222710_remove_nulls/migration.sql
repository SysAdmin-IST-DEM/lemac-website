/*
  Warnings:

  - Made the column `workstation_id` on table `entries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ist_id` on table `entries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `entries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mifare_id` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ist_id` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `course` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `lemac_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exit` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry_number` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exit_number` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `safe_amount` on table `log_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `monitor_schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry` on table `monitor_schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exit` on table `monitor_schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `monitor_targets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_start` on table `monitor_targets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_end` on table `monitor_targets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `target_hours` on table `monitor_targets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `publications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `publications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `room_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `room_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room_data_id` on table `room_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exit` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reservation_name` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reservation_id` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `given_key` on table `room_hours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `admin` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `workstations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `workstations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `workstations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `workstations` required. This step will fail if there are existing NULL values in that column.

*/
DELETE FROM `entries` WHERE `workstation_id` IS NULL;
UPDATE `log_hours`
SET `exit_number` = `entry_number`
WHERE `exit_number` IS NULL;
DELETE FROM `monitor_schedule` WHERE `user_id` IS NULL;
DELETE FROM `room_hours` WHERE `user_id` IS NULL;

-- DropForeignKey
ALTER TABLE `entries` DROP FOREIGN KEY `entries_workstation_id_fkey`;

-- DropForeignKey
ALTER TABLE `log_hours` DROP FOREIGN KEY `log_hours_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `monitor_schedule` DROP FOREIGN KEY `monitor_schedule_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `monitor_targets` DROP FOREIGN KEY `monitor_targets_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `room_events` DROP FOREIGN KEY `room_events_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `room_hours` DROP FOREIGN KEY `room_hours_user_id_fkey`;

-- DropIndex
DROP INDEX `monitor_targets_user_id_fkey` ON `monitor_targets`;

-- DropIndex
DROP INDEX `room_events_user_id_fkey` ON `room_events`;

-- AlterTable
ALTER TABLE `entries` MODIFY `workstation_id` INTEGER NOT NULL,
    MODIFY `ist_id` VARCHAR(12) NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `lemac_users` MODIFY `mifare_id` VARCHAR(64) NOT NULL,
    MODIFY `name` VARCHAR(64) NOT NULL,
    MODIFY `ist_id` INTEGER NOT NULL,
    MODIFY `email` TEXT NOT NULL,
    MODIFY `course` VARCHAR(64) NOT NULL,
    MODIFY `state` ENUM('online', 'in_break', 'offline') NOT NULL;

-- AlterTable
ALTER TABLE `log_hours` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `entry` DATETIME(0) NOT NULL,
    MODIFY `exit` DATETIME(0) NOT NULL,
    MODIFY `time` INTEGER NOT NULL,
    MODIFY `entry_number` INTEGER NOT NULL,
    MODIFY `exit_number` INTEGER NOT NULL,
    MODIFY `safe_amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `monitor_schedule` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `entry` DATETIME(0) NOT NULL,
    MODIFY `exit` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `monitor_targets` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `date_start` DATE NOT NULL,
    MODIFY `date_end` DATE NOT NULL,
    MODIFY `target_hours` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `publications` MODIFY `text` TEXT NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `room_events` MODIFY `type` VARCHAR(255) NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `room_data_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `room_hours` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `entry` DATETIME(0) NOT NULL,
    MODIFY `exit` DATETIME(0) NOT NULL,
    MODIFY `room` VARCHAR(255) NOT NULL,
    MODIFY `reservation_name` VARCHAR(255) NOT NULL,
    MODIFY `reservation_id` INTEGER NOT NULL,
    MODIFY `given_key` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `admin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `color` CHAR(7) NOT NULL DEFAULT '#0076DC';

-- AlterTable
ALTER TABLE `workstations` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `capacity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `occupation` INTEGER NOT NULL DEFAULT 0,
    MODIFY `type` ENUM('active', 'disabled', 'remote') NOT NULL;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `entries_workstation_id_fkey` FOREIGN KEY (`workstation_id`) REFERENCES `workstations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `log_hours` ADD CONSTRAINT `log_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monitor_schedule` ADD CONSTRAINT `monitor_schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monitor_targets` ADD CONSTRAINT `monitor_targets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_hours` ADD CONSTRAINT `room_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
