/*
  Warnings:

  - You are about to alter the column `type` on the `room_events` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[name]` on the table `workstations` will be added. If there are existing duplicate values, this will fail.
  - Made the column `software` on table `workstations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `problems` on table `workstations` required. This step will fail if there are existing NULL values in that column.

*/
-- RemoveProblemsAndSoftwareNulls
UPDATE workstations SET software = '[]' WHERE software IS NULL;
UPDATE workstations SET problems = '[]' WHERE problems IS NULL;

-- AlterTable
ALTER TABLE `room_events` MODIFY `type` ENUM('res_created', 'res_updated', 'res_deleted', 'key_given', 'key_received') NOT NULL;

-- AlterTable
ALTER TABLE `workstations` MODIFY `software` LONGTEXT NOT NULL DEFAULT '[]',
                           MODIFY `problems` LONGTEXT NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE UNIQUE INDEX `workstations_name_key` ON `workstations`(`name`);

-- DeleteOrphanedRoomEvents
DELETE re
FROM room_events re
         LEFT JOIN room_hours rh ON rh.id = re.room_data_id
WHERE re.room_data_id IS NOT NULL AND rh.id IS NULL;

-- AddForeignKey
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_room_data_id_fkey` FOREIGN KEY (`room_data_id`) REFERENCES `room_hours`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;