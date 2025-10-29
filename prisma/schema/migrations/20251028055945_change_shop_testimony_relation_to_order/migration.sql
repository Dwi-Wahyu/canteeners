/*
  Warnings:

  - You are about to drop the column `customer_id` on the `shop_testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `shop_id` on the `shop_testimonies` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `shop_testimonies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shop_testimonies` DROP FOREIGN KEY `shop_testimonies_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `shop_testimonies` DROP FOREIGN KEY `shop_testimonies_shop_id_fkey`;

-- DropIndex
DROP INDEX `shop_testimonies_customer_id_fkey` ON `shop_testimonies`;

-- DropIndex
DROP INDEX `shop_testimonies_shop_id_fkey` ON `shop_testimonies`;

-- AlterTable
ALTER TABLE `shop_testimonies` DROP COLUMN `customer_id`,
    DROP COLUMN `shop_id`,
    ADD COLUMN `order_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `shop_testimonies` ADD CONSTRAINT `shop_testimonies_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
