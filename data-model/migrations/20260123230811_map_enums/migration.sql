/*
  Warnings:

  - The values [online,in_break,offline] on the enum `lemac_users_state` will be removed. If these variants are still used in the database, this will fail.
  - The values [res_created,res_updated,res_deleted,key_given,key_received] on the enum `room_events_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,disabled,remote] on the enum `workstations_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
UPDATE `lemac_users` SET `state` = 'ONLINE' WHERE `state` = 'online';
UPDATE `lemac_users` SET `state` = 'IN_BREAK' WHERE `state` = 'in_break';
UPDATE `lemac_users` SET `state` = 'OFFLINE' WHERE `state` = 'offline';
ALTER TABLE `lemac_users` MODIFY `state` ENUM('ONLINE', 'IN_BREAK', 'OFFLINE') NOT NULL;

-- AlterTable
UPDATE `room_events` SET `type` = 'RES_CREATED' WHERE `type` = 'res_created';
UPDATE `room_events` SET `type` = 'RES_UPDATED' WHERE `type` = 'res_updated';
UPDATE `room_events` SET `type` = 'RES_DELETED' WHERE `type` = 'res_deleted';
UPDATE `room_events` SET `type` = 'KEY_GIVEN' WHERE `type` = 'key_given';
UPDATE `room_events` SET `type` = 'KEY_RECEIVED' WHERE `type` = 'key_received';
ALTER TABLE `room_events` MODIFY `type` ENUM('RES_CREATED', 'RES_UPDATED', 'RES_DELETED', 'KEY_GIVEN', 'KEY_RECEIVED') NOT NULL;

-- AlterTable
UPDATE `workstations` SET `type` = 'ACTIVE' WHERE `type` = 'active';
UPDATE `workstations` SET `type` = 'DISABLED' WHERE `type` = 'disabled';
UPDATE `workstations` SET `type` = 'REMOTE' WHERE `type` = 'remote';
ALTER TABLE `workstations` MODIFY `type` ENUM('ACTIVE', 'DISABLED', 'REMOTE') NOT NULL;
