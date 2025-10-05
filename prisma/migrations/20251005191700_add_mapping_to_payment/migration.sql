/*
  Warnings:

  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_shop_id_fkey`;

-- DropTable
DROP TABLE `payment`;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method` ENUM('QRIS', 'BANK_TRANSFER', 'CASH') NOT NULL,
    `qr_url` VARCHAR(191) NULL,
    `account_number` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `additional_price` DOUBLE NULL,
    `shop_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
