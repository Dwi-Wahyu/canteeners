/*
  Warnings:

  - You are about to drop the `product_options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_options` DROP FOREIGN KEY `product_options_product_id_fkey`;

-- DropTable
DROP TABLE `product_options`;
