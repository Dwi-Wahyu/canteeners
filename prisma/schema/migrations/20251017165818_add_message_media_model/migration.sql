/*
  Warnings:

  - You are about to drop the column `image_url` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `messages` DROP COLUMN `image_url`,
    MODIFY `type` ENUM('TEXT', 'SYSTEM', 'ORDER', 'PAYMENT_PROOF') NOT NULL DEFAULT 'TEXT';

-- CreateTable
CREATE TABLE `message_media` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `mime_type` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,

    INDEX `message_media_message_id_idx`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `message_media` ADD CONSTRAINT `message_media_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
