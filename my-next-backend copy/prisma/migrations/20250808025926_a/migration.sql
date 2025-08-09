/*
  Warnings:

  - The primary key for the `Classification` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Classification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Classification_id_seq";

-- AlterTable
ALTER TABLE "actions" ALTER COLUMN "id" SET DATA TYPE TEXT;
