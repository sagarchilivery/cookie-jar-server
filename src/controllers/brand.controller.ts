import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const brands = await prisma.brand.findMany();
    return res.status(200).json({ success: true, data: brands });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Required: name" });
    }

    const doesBrandExist = await prisma.brand.findFirst({
      where: { name },
    });

    if (doesBrandExist) {
      return res
        .status(400)
        .json({ success: false, message: "Brand already exists" });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
      },
    });
    return res.status(201).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const getBrandById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id: id },
    });

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Required: name" });
    }

    const brand = await prisma.brand.update({
      where: { id: id },
      data: {
        name,
      },
    });

    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const brand = await prisma.brand.delete({
      where: { id: id },
    });

    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
