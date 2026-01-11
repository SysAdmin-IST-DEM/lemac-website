-- AlterTable
ALTER TABLE `print_tasks` ADD COLUMN `assigned_id` INTEGER NULL,
    ADD COLUMN `resolved_at` TIMESTAMP(0) NULL;

-- AddForeignKey
ALTER TABLE `print_tasks` ADD CONSTRAINT `print_tasks_assigned_id_fkey` FOREIGN KEY (`assigned_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT;
