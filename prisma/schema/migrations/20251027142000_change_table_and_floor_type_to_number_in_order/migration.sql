/*
  Warnings:

  - You are about to alter the column `floor` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `table_number` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `floor` INTEGER NULL,
    MODIFY `table_number` INTEGER NULL;
