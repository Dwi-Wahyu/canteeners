/*
  Warnings:

  - Added the required column `rating` to the `shop_testimonies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shop_testimonies` ADD COLUMN `rating` INTEGER NOT NULL;
