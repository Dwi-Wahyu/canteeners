/*
  Warnings:

  - The values [WAITING_CUSTOMER_ESTIMATION_CONFIRMATION,ESTIMATION_REJECTED] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING_CONFIRMATION', 'WAITING_PAYMENT', 'WAITING_SHOP_CONFIRMATION', 'PROCESSING', 'COMPLETED', 'REJECTED', 'PAYMENT_REJECTED', 'CANCELLED') NOT NULL;
