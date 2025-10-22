/*
  Warnings:

  - A unique constraint covering the columns `[table_number,canteen_id,floor]` on the table `table_qrcodes` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `table_qrcodes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `table_qrcodes_table_number_canteen_id_key` ON `table_qrcodes`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `table_qr_id` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('READY', 'PREORDER') NOT NULL DEFAULT 'READY';

-- AlterTable
ALTER TABLE `table_qrcodes` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `table_qrcodes_table_number_canteen_id_floor_key` ON `table_qrcodes`(`table_number`, `canteen_id`, `floor`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_table_qr_id_fkey` FOREIGN KEY (`table_qr_id`) REFERENCES `table_qrcodes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
