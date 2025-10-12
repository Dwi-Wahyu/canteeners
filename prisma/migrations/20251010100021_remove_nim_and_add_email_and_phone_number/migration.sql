/*
  Warnings:

  - You are about to drop the column `nim` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `nim`,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL;
