/*
  Warnings:

  - You are about to drop the column `proof_url` on the `refunds` table. All the data in the column will be lost.
  - The primary key for the `shop_complaints` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `refunds` DROP COLUMN `proof_url`,
    ADD COLUMN `complaint_proof_url` VARCHAR(191) NULL,
    ADD COLUMN `disbursement_proof_url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shop_complaints` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
