-- AlterTable
ALTER TABLE `shops` ADD COLUMN `refund_disbursement_mode` ENUM('CASH', 'TRANSFER') NOT NULL DEFAULT 'CASH';
