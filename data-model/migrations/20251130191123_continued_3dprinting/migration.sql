-- CreateTable
CREATE TABLE `print_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `model_file` VARCHAR(255) NOT NULL,
    `material_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'in_queue', 'printing', 'completed', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `amount` INTEGER NOT NULL DEFAULT 1,
    `student_id` VARCHAR(12) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `unit` ENUM('MILIMETERS', 'CENTIMETERS', 'METERS') NOT NULL,
    `price` DOUBLE NOT NULL,
    `deadline` DATE NULL,
    `observations` TEXT NOT NULL DEFAULT '',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `print_materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price_multiplier` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `print_tasks` ADD CONSTRAINT `print_tasks_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `print_materials`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
