-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'WORKER');

-- CreateEnum
CREATE TYPE "ArrivalStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'DAMAGED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'WORKER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "id" TEXT NOT NULL,
    "arrivalNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "expectedArrivalDate" TIMESTAMP(3) NOT NULL,
    "actualArrivalDate" TIMESTAMP(3),
    "finishDate" TIMESTAMP(3),
    "status" "ArrivalStatus" NOT NULL DEFAULT 'UPCOMING',
    "summary" TEXT,
    "expected_pallets" INTEGER,
    "expected_boxes" INTEGER,
    "expected_kilograms" DOUBLE PRECISION,
    "expected_pieces" INTEGER,
    "actual_pallets" INTEGER,
    "actual_boxes" INTEGER,
    "actual_kilograms" DOUBLE PRECISION,
    "actual_pieces" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "brandId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "style" TEXT,
    "condition" "ProductCondition" NOT NULL DEFAULT 'NEW',
    "quantity" INTEGER NOT NULL,
    "arrivalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_arrivalNumber_key" ON "Arrival"("arrivalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
