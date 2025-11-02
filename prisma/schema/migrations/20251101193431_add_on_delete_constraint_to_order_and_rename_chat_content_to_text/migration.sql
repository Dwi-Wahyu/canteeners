/*
  Warnings:

  - You are about to drop the column `content` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `message_media` DROP FOREIGN KEY `message_media_message_id_fkey`;

-- DropForeignKey
ALTER TABLE `refunds` DROP FOREIGN KEY `refunds_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `shop_complaints` DROP FOREIGN KEY `shop_complaints_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `shop_testimonies` DROP FOREIGN KEY `shop_testimonies_order_id_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `content`,
    ADD COLUMN `text` LONGTEXT NULL;

-- AddForeignKey
ALTER TABLE `message_media` ADD CONSTRAINT `message_media_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_complaints` ADD CONSTRAINT `shop_complaints_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_testimonies` ADD CONSTRAINT `shop_testimonies_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
