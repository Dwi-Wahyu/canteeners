/*
  Warnings:

  - You are about to drop the `violations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `violations` DROP FOREIGN KEY `violations_customer_id_fkey`;

-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING_CONFIRMATION', 'WAITING_PAYMENT', 'WAITING_SHOP_CONFIRMATION', 'PROCESSING', 'COMPLETED', 'REJECTED', 'PAYMENT_REJECTED', 'CANCELLED') NOT NULL;

-- DropTable
DROP TABLE `violations`;

-- CreateTable
CREATE TABLE `customer_violations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `sum` INTEGER NULL DEFAULT 0,
    `type` ENUM('ORDER_CANCEL_WITHOUT_PAY') NOT NULL,
    `customer_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer_violations` ADD CONSTRAINT `customer_violations_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
