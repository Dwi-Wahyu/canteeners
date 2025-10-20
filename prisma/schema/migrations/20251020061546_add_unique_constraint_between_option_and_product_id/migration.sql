/*
  Warnings:

  - A unique constraint covering the columns `[option,product_id]` on the table `product_options` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `product_options_option_product_id_key` ON `product_options`(`option`, `product_id`);
