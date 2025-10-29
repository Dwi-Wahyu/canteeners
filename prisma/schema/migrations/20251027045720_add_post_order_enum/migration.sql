/*
  Warnings:

  - You are about to drop the column `table_qr_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_table_qr_id_fkey`;

-- DropIndex
DROP INDEX `orders_table_qr_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `table_qr_id`,
    ADD COLUMN `floor` VARCHAR(191) NULL,
    ADD COLUMN `post_order_type` ENUM('DELIVERY_TO_TABLE', 'TAKEAWAY', 'COURIER_DELIVERY') NOT NULL DEFAULT 'DELIVERY_TO_TABLE',
    ADD COLUMN `table_number` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shop_carts` ADD COLUMN `post_order_type` ENUM('DELIVERY_TO_TABLE', 'TAKEAWAY', 'COURIER_DELIVERY') NOT NULL DEFAULT 'DELIVERY_TO_TABLE';
