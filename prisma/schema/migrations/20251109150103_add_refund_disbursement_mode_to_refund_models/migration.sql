/*
  Warnings:

  - Added the required column `disbursement_mode` to the `refunds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refunds` ADD COLUMN `disbursement_mode` ENUM('CASH', 'TRANSFER') NOT NULL;
