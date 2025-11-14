/*
  Warnings:

  - Added the required column `customer_name` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_conversation_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_customer_id_fkey`;

-- DropIndex
DROP INDEX `orders_conversation_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `cancelled_by_name` VARCHAR(191) NULL,
    ADD COLUMN `customer_name` VARCHAR(191) NOT NULL,
    MODIFY `customer_id` VARCHAR(191) NULL,
    MODIFY `conversation_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `orders_customer_name_idx` ON `orders`(`customer_name`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
