/*
  Warnings:

  - You are about to drop the column `shop_id` on the `shop_complaints` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `shop_complaints` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `shop_testimonies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feedback` to the `shop_complaints` table without a default value. This is not possible if the table is not empty.
  - Made the column `order_id` on table `shop_complaints` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `shop_complaints` DROP FOREIGN KEY `shop_complaints_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `shop_complaints` DROP FOREIGN KEY `shop_complaints_shop_id_fkey`;

-- DropIndex
DROP INDEX `shop_complaints_order_id_fkey` ON `shop_complaints`;

-- DropIndex
DROP INDEX `shop_complaints_shop_id_fkey` ON `shop_complaints`;

-- AlterTable
ALTER TABLE `shop_complaints` DROP COLUMN `shop_id`,
    ADD COLUMN `feedback` LONGTEXT NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED') NOT NULL DEFAULT 'PENDING',
    MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shop_testimonies` ADD COLUMN `proof_url` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `refunds` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `complaint_id` INTEGER NULL,
    `proof_url` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `reason` ENUM('LATE_DELIVERY', 'WRONG_ORDER', 'DAMAGED_FOOD', 'MISSING_ITEM', 'OTHER') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `requested_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_at` DATETIME(3) NULL,
    `rejected_reason` VARCHAR(191) NULL,

    UNIQUE INDEX `refunds_order_id_key`(`order_id`),
    UNIQUE INDEX `refunds_complaint_id_key`(`complaint_id`),
    INDEX `refunds_order_id_idx`(`order_id`),
    INDEX `refunds_status_idx`(`status`),
    INDEX `refunds_complaint_id_idx`(`complaint_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `shop_complaints_order_id_key` ON `shop_complaints`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `shop_testimonies_order_id_key` ON `shop_testimonies`(`order_id`);

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_complaint_id_fkey` FOREIGN KEY (`complaint_id`) REFERENCES `shop_complaints`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_complaints` ADD CONSTRAINT `shop_complaints_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
