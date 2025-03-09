/*
  Warnings:

  - The `condition` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'DAMAGED');

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "size" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "style" DROP NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" "ProductCondition" NOT NULL DEFAULT 'NEW';
