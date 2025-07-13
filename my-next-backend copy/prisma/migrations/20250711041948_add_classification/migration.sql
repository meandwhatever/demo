/*
  Warnings:

  - You are about to alter the column `confidence` on the `Classification` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Classification" ALTER COLUMN "hs_code" DROP NOT NULL,
ALTER COLUMN "confidence" DROP NOT NULL,
ALTER COLUMN "confidence" SET DATA TYPE INTEGER,
ALTER COLUMN "product_title" DROP NOT NULL,
ALTER COLUMN "product_description" DROP NOT NULL,
ALTER COLUMN "first_two_digits" DROP NOT NULL,
ALTER COLUMN "broader_description" DROP NOT NULL;
