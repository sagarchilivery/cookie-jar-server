-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'WORKER');

-- CreateEnum
CREATE TYPE "ArrivalStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ELECTRONICS', 'FASHION', 'GROCERY', 'FURNITURE', 'SPORTS', 'AUTOMOTIVE', 'HOME_APPLIANCES', 'TOYS', 'BOOKS', 'HEALTH', 'JEWELRY');

-- CreateEnum
CREATE TYPE "ProductStyle" AS ENUM ('CASUAL', 'FORMAL', 'SPORTY', 'TRADITIONAL', 'STREETWEAR', 'VINTAGE', 'MINIMALIST', 'LUXURY', 'INDUSTRIAL', 'MODERN', 'TECH', 'FUNCTIONAL');

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
    "expected_pallets" INTEGER NOT NULL,
    "expected_boxes" INTEGER NOT NULL,
    "expected_kilograms" DOUBLE PRECISION NOT NULL,
    "expected_quantity" INTEGER NOT NULL,
    "actual_pallets" INTEGER,
    "actual_boxes" INTEGER,
    "actual_kilograms" DOUBLE PRECISION,
    "actual_quantity" INTEGER,
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
    "category" "ProductCategory",
    "size" TEXT,
    "color" TEXT,
    "style" "ProductStyle",
    "condition" "ProductCondition" DEFAULT 'NEW',
    "quantity" INTEGER,
    "added" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
