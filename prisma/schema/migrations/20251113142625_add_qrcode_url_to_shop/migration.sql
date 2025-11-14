-- AlterTable
ALTER TABLE `shops` ADD COLUMN `qrcode_url` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `shop_billings` ADD CONSTRAINT `shop_billings_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
