/*
  Warnings:

  - You are about to drop the column `mifare_number` on the `students` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE `student_cards` (
                                 `id` INTEGER NOT NULL AUTO_INCREMENT,
                                 `student_id` INTEGER NOT NULL,
                                 `mifare_number` BIGINT NOT NULL,
                                 `last_updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                                 `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

                                 UNIQUE INDEX `student_cards_mifare_number_key`(`mifare_number`),
                                 INDEX `student_cards_student_id_idx`(`student_id`),
                                 PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_cards` ADD CONSTRAINT `student_cards_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- MigrateMifareNumbers
INSERT INTO `student_cards` (`student_id`, `mifare_number`)
SELECT `id`, `mifare_number`
FROM `students`
WHERE `mifare_number` IS NOT NULL;

-- DropIndex
DROP INDEX `students_mifare_number_key` ON `students`;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `mifare_number`;