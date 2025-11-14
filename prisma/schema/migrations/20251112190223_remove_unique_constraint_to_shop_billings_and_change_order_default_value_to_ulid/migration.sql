-- DropForeignKey
ALTER TABLE `shop_billings` DROP FOREIGN KEY `shop_billings_shop_id_fkey`;

-- DropIndex
DROP INDEX `shop_billings_shop_id_key` ON `shop_billings`;