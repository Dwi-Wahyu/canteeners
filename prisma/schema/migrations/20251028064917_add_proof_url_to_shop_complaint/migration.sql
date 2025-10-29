/*
  Warnings:

  - You are about to drop the column `proof_url` on the `shop_testimonies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `shop_complaints` ADD COLUMN `proof_url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shop_testimonies` DROP COLUMN `proof_url`;
