/*
  Warnings:

  - Added the required column `role` to the `app_testimonies` table without a default value. This is not possible if the table is not empty.
  - Made the column `from` on table `app_testimonies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `app_testimonies` ADD COLUMN `role` VARCHAR(191) NOT NULL,
    MODIFY `from` VARCHAR(191) NOT NULL;
