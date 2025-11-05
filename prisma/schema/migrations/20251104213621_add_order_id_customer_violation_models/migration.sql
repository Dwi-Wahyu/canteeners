/*
  Warnings:

  - You are about to drop the column `sum` on the `customer_violations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer_violations` DROP COLUMN `sum`,
    ADD COLUMN `order_id` VARCHAR(191) NULL;
