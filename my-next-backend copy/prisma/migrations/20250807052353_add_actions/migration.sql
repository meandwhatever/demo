/*
  Warnings:

  - The primary key for the `Classification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Classification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Shipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Classification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "actions" (
    "db_id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("db_id")
);
