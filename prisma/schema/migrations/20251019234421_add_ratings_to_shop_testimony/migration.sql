-- AlterTable
ALTER TABLE `app_testimonies` MODIFY `role` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shop_complaints` MODIFY `cause` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `shop_testimonies` ADD COLUMN `shop_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shops` ADD COLUMN `average_rating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `order_mode` ENUM('PREORDER_ONLY', 'READY_ONLY', 'BOTH') NOT NULL DEFAULT 'READY_ONLY',
    ADD COLUMN `total_ratings` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `shop_testimonies` ADD CONSTRAINT `shop_testimonies_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
