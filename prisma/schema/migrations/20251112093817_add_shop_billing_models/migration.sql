-- CreateTable
CREATE TABLE `shop_billings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `refund` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `status` ENUM('PAID', 'UNPAID') NOT NULL DEFAULT 'UNPAID',

    UNIQUE INDEX `shop_billings_shop_id_key`(`shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shop_billings` ADD CONSTRAINT `shop_billings_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
