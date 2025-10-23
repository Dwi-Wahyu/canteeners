-- CreateTable
CREATE TABLE `carts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'CHECKED_OUT', 'ABANDONED', 'EXPIRED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    `expires_at` DATETIME(3) NULL,

    UNIQUE INDEX `carts_user_id_key`(`user_id`),
    INDEX `carts_user_id_idx`(`user_id`),
    INDEX `carts_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_carts` (
    `id` VARCHAR(191) NOT NULL,
    `cart_id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ORDERED', 'REMOVED') NOT NULL DEFAULT 'PENDING',
    `shop_id` VARCHAR(191) NOT NULL,
    `payment_method` ENUM('QRIS', 'BANK_TRANSFER', 'CASH') NOT NULL DEFAULT 'CASH',
    `total_price` DOUBLE NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,

    INDEX `shop_carts_cart_id_idx`(`cart_id`),
    INDEX `shop_carts_shop_id_idx`(`shop_id`),
    UNIQUE INDEX `shop_carts_cart_id_shop_id_key`(`cart_id`, `shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `shop_cart_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_at_add` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,

    INDEX `cart_items_shop_cart_id_idx`(`shop_cart_id`),
    INDEX `cart_items_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_carts` ADD CONSTRAINT `shop_carts_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_carts` ADD CONSTRAINT `shop_carts_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_shop_cart_id_fkey` FOREIGN KEY (`shop_cart_id`) REFERENCES `shop_carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
