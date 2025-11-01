/*
  Warnings:

  - You are about to drop the column `complaint_id` on the `refunds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `refunds` DROP FOREIGN KEY `refunds_complaint_id_fkey`;

-- DropIndex
DROP INDEX `refunds_complaint_id_idx` ON `refunds`;

-- DropIndex
DROP INDEX `refunds_complaint_id_key` ON `refunds`;

-- AlterTable
ALTER TABLE `refunds` DROP COLUMN `complaint_id`,
    ADD COLUMN `description` LONGTEXT NULL;
