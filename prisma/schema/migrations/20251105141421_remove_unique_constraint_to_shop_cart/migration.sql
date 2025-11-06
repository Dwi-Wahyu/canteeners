-- DropForeignKey
ALTER TABLE `shop_carts` DROP FOREIGN KEY `shop_carts_cart_id_fkey`;

-- DropIndex
DROP INDEX `shop_carts_cart_id_shop_id_key` ON `shop_carts`;

