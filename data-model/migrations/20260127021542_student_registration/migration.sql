/*
  Warnings:

  - You are about to drop the `lemac_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `lemac_users`;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ist_id` VARCHAR(12) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` TEXT NOT NULL,
    `mifare_number` VARCHAR(32) NOT NULL,
    `course_id` VARCHAR(16) NOT NULL,
    `last_renewed` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `students_ist_id_key`(`ist_id`),
    UNIQUE INDEX `students_mifare_number_key`(`mifare_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
