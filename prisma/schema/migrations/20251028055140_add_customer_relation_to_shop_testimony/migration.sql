/*
  Warnings:

  - You are about to drop the column `from` on the `shop_testimonies` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `shop_testimonies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shop_testimonies` DROP COLUMN `from`,
    ADD COLUMN `customer_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `shop_testimonies` ADD CONSTRAINT `shop_testimonies_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
