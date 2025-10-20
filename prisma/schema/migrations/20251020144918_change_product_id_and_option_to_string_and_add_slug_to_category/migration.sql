/*
  Warnings:

  - The primary key for the `product_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_categories` DROP FOREIGN KEY `product_categories_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_options` DROP FOREIGN KEY `product_options_product_id_fkey`;

-- DropIndex
DROP INDEX `order_items_product_id_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `product_options_product_id_fkey` ON `product_options`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order_items` MODIFY `product_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product_categories` DROP PRIMARY KEY,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`product_id`, `category_id`);

-- AlterTable
ALTER TABLE `product_options` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_slug_key` ON `categories`(`slug`);

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
