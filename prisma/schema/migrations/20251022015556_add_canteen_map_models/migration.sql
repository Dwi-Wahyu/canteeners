/*
  Warnings:

  - Added the required column `map_id` to the `table_qrcodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `table_qrcodes` ADD COLUMN `map_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `canteen_maps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` VARCHAR(191) NOT NULL,
    `floor` INTEGER NOT NULL,
    `canteen_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `canteen_maps` ADD CONSTRAINT `canteen_maps_canteen_id_fkey` FOREIGN KEY (`canteen_id`) REFERENCES `canteens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `table_qrcodes` ADD CONSTRAINT `table_qrcodes_map_id_fkey` FOREIGN KEY (`map_id`) REFERENCES `canteen_maps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
