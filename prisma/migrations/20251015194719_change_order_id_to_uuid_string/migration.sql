/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_order_id_fkey`;

-- DropIndex
DROP INDEX `messages_order_id_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `messages` MODIFY `order_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order_items` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
