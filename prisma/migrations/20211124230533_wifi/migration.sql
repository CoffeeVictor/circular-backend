-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('GPS', 'WIFI');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "origin" "Origin" NOT NULL DEFAULT E'GPS';
