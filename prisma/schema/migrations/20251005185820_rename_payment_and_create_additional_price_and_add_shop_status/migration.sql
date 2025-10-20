-- AlterTable
ALTER TABLE `payment` ADD COLUMN `additional_price` DOUBLE NULL;

-- AlterTable
ALTER TABLE `shops` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `suspended_reason` VARCHAR(191) NULL;
