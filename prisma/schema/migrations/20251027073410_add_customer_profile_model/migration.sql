-- CreateTable
CREATE TABLE `customer_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `canteen_id` INTEGER NULL,
    `floor` INTEGER NULL,
    `table_number` INTEGER NULL,
    `last_visit_at` DATETIME(3) NULL,

    UNIQUE INDEX `customer_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer_profiles` ADD CONSTRAINT `customer_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
