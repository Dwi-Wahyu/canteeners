-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `product_options_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `product_options` (
    `id` VARCHAR(191) NOT NULL,
    `option` VARCHAR(191) NOT NULL,
    `grouped_by` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `additional_price` DOUBLE NULL,
    `product_id` VARCHAR(191) NOT NULL,

    INDEX `product_options_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
