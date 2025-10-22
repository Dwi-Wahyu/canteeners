-- CreateTable
CREATE TABLE `table_qrcodes` (
    `table_number` INTEGER NOT NULL,
    `floor` INTEGER NOT NULL,
    `canteen_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `table_qrcodes_table_number_canteen_id_key`(`table_number`, `canteen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `table_qrcodes` ADD CONSTRAINT `table_qrcodes_canteen_id_fkey` FOREIGN KEY (`canteen_id`) REFERENCES `canteens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
