/*
  Warnings:

  - You are about to drop the column `email` on the `print_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `student_name` on the `print_tasks` table. All the data in the column will be lost.
  - You are about to alter the column `student_id` on the `print_tasks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `Int`.

*/

-- AlterTable
ALTER TABLE `students` ADD COLUMN `is_dem` BOOLEAN NOT NULL DEFAULT true;

-- AddStudentsFromPrintTasks
INSERT INTO students (ist_id, name, email, last_renewed, created_at, is_dem)
SELECT
    ranked_tasks.student_id AS ist_id,
    ranked_tasks.student_name AS name,
    ranked_tasks.email AS email,
    CURRENT_DATE() AS last_renewed,
    NOW() AS created_at,
    FALSE AS is_dem
FROM (
         SELECT
             pt.student_id,
             pt.student_name,
             pt.email,
             ROW_NUMBER() OVER (
            PARTITION BY pt.student_id
            ORDER BY LENGTH(pt.student_name) DESC, LENGTH(pt.email) DESC
        ) as rn
         FROM
             print_tasks pt
                 LEFT JOIN
             students s ON pt.student_id = s.ist_id
         WHERE
             s.ist_id IS NULL
           AND pt.student_id IS NOT NULL
     ) ranked_tasks
WHERE
    ranked_tasks.rn = 1;

-- UpdateStudentIDs
UPDATE print_tasks pt
    JOIN students s ON pt.student_id = s.ist_id
    SET pt.student_id = CAST(s.id AS CHAR);

-- AlterTable
ALTER TABLE `print_tasks` DROP COLUMN `email`,
DROP COLUMN `student_name`,
    MODIFY `student_id` INTEGER NOT NULL;

-- CreateTable-- AddStudentsFromPrintTasks
CREATE TABLE `student_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `print_task_id` INTEGER NULL,

    UNIQUE INDEX `student_transactions_print_task_id_key`(`print_task_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `print_tasks` ADD CONSTRAINT `print_tasks_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_transactions` ADD CONSTRAINT `student_transactions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_transactions` ADD CONSTRAINT `student_transactions_print_task_id_fkey` FOREIGN KEY (`print_task_id`) REFERENCES `print_tasks`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
