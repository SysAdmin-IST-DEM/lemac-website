-- CreateTable
CREATE TABLE `entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workstation_id` INTEGER NULL,
    `ist_id` VARCHAR(12) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `closed_at` TIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `observations` TEXT NULL,

    INDEX `workstation_id`(`workstation_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lemac_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mifare_id` VARCHAR(64) NULL,
    `name` VARCHAR(64) NULL,
    `ist_id` INTEGER NULL,
    `email` TEXT NULL,
    `course` VARCHAR(64) NULL,
    `state` ENUM('online', 'in_break', 'offline') NULL,
    `last_modified` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `entry` DATETIME(0) NULL,
    `exit` DATETIME(0) NULL,
    `time` INTEGER NULL,
    `entry_number` INTEGER NULL,
    `exit_number` INTEGER NULL,
    `safe_amount` INTEGER NULL,

    INDEX `user_id`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitor_hours_targets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `week` INTEGER NULL,
    `target_hours` INTEGER NULL,
    `target_offset` INTEGER NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitor_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `entry` DATETIME(0) NULL,
    `exit` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitor_targets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `date_start` DATE NULL,
    `date_end` DATE NULL,
    `target_hours` INTEGER NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `text` TEXT NULL,

    INDEX `user_id`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `off_days` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `text` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NULL,
    `user_id` INTEGER NULL,
    `room_data_id` INTEGER NULL,
    `observations` TEXT NULL DEFAULT '',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `entry` DATETIME(0) NULL,
    `exit` DATETIME(0) NULL,
    `room` VARCHAR(255) NULL,
    `reservation_name` VARCHAR(255) NULL,
    `reservation_id` INTEGER NULL,
    `given_key` BOOLEAN NULL DEFAULT false,

    INDEX `user_id`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ist_id` VARCHAR(12) NOT NULL,
    `name` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `admin` BOOLEAN NULL DEFAULT false,
    `color` CHAR(7) NULL DEFAULT '#0076DC',

    UNIQUE INDEX `ist_id`(`ist_id` ASC),
    PRIMARY KEY (`user_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workstations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `capacity` INTEGER NULL DEFAULT 0,
    `occupation` INTEGER NULL DEFAULT 0,
    `type` ENUM('active', 'disabled', 'remote') NULL,
    `software` LONGTEXT NULL,
    `problems` LONGTEXT NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `entries_ibfk_1` FOREIGN KEY (`workstation_id`) REFERENCES `workstations`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `log_hours` ADD CONSTRAINT `log_hours_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monitor_schedule` ADD CONSTRAINT `monitor_schedule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_hours` ADD CONSTRAINT `room_hours_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

