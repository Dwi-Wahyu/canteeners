-- AlterTable
ALTER TABLE `products` ADD COLUMN `is_available` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `violations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `sum` INTEGER NULL DEFAULT 0,
    `type` ENUM('ORDER_CANCEL_WITHOUT_PAY') NOT NULL,
    `customer_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `violations` ADD CONSTRAINT `violations_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
