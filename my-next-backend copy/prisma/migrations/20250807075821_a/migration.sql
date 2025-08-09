-- AlterTable
ALTER TABLE "actions" ADD COLUMN     "updated_reason" TEXT,
ALTER COLUMN "user" DROP NOT NULL;
