-- AlterTable
ALTER TABLE `orders` ADD COLUMN `cancelled_by_id` VARCHAR(191) NULL,
    ADD COLUMN `cancelled_reason` VARCHAR(191) NULL;
