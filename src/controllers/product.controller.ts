// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { prisma } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const generateNewSKU = () => {
  return `SKU-${uuidv4()}`;
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let {
      barcode,
      name,
      description,
      brandId,
      category,
      size,
      color,
      style,
      condition,
      quantity,
      arrivalId,
    } = req.body;

    if (!name || !brandId || !condition || !quantity || !arrivalId) {
      return res.status(400).json({
        success: false,
        message: "Required : name, brandId, condition, quantity, arrivalId",
      });
    }

    const doesBrandExist = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!doesBrandExist) {
      return res.status(400).json({
        success: false,
        message: "Brand does not exist",
      });
    }

    // Step 1: Search for an existing product with matching fields
    const existingProduct = await prisma.product.findFirst({
      where: {
        brandId,
        name,
        category,
        size: size || null,
        color: color || null,
        style: style || null,
        condition,
      },
    });

    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    if (existingProduct) {
      if (existingProduct.arrivalId === arrivalId) {
        // ✅ Same `arrivalId` → Update quantity
        const updatedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            quantity: existingProduct.quantity + quantity,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Product quantity updated",
          data: updatedProduct,
        });
      } else {
        // ❌ Different `arrivalId` → Reuse SKU, create a new product
        const newProduct = await prisma.product.create({
          data: {
            barcode,
            name,
            description,
            brandId,
            category,
            size: size || null,
            color: color || null,
            style: style || null,
            condition,
            quantity,
            arrivalId,
            sku: existingProduct.sku, // Reusing the old SKU
          },
        });

        return res.status(201).json({
          success: true,
          message: "New product created with reused SKU",
          data: newProduct,
        });
      }
    }

    // Step 3: No matching product → Create new product with new SKU
    const newProduct = await prisma.product.create({
      data: {
        barcode,
        name,
        description,
        brandId,
        category,
        size: size || null,
        color: color || null,
        style: style || null,
        condition,
        quantity,
        arrivalId,
        sku: generateNewSKU(), // Generate a new SKU
      },
    });

    return res.status(201).json({
      success: true,
      message: "New product created with new SKU",
      data: newProduct,
    });
  } catch (error) {
    console.log("Error creating product", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
