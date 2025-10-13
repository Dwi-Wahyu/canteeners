/*
  Warnings:

  - You are about to drop the `quickchat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `quickchat` DROP FOREIGN KEY `QuickChat_user_id_fkey`;

-- DropTable
DROP TABLE `quickchat`;

-- CreateTable
CREATE TABLE `quick_chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quick_chats` ADD CONSTRAINT `quick_chats_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
