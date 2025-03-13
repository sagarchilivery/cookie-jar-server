// src/controllers/arrival.controller.ts

import { Request, Response } from "express";
import { getNextArrivalNumber, prisma } from "../config/db";

export const getAllArrivals = async (req: Request, res: Response) => {
  try {
    const { status, sort } = req.query;

    // Validate status if provided
    const validStatuses = ["UPCOMING", "IN_PROGRESS", "FINISHED"];
    const statusFilter: any =
      typeof status === "string" && validStatuses.includes(status.toUpperCase())
        ? { status: status.toUpperCase() }
        : {};

    // Validate sorting order (asc or desc)
    const orderBy = sort === "desc" ? "desc" : "asc";

    // Fetch arrivals with filtering and sorting
    const arrivals = await prisma.arrival.findMany({
      where: statusFilter, // Apply status filter if provided
      orderBy: {
        expectedArrivalDate: orderBy, // Sort by date
      },
      include: {
        products: true,
      },
    });

    // Calculate total quantity for each arrival
    const updatedArrivals = arrivals.map((arrival) => {
      const totalQuantity = arrival.products.reduce((sum, product) => {
        return sum + (product.quantity || 0);
      }, 0);

      return {
        ...arrival,
        actual_quantity: totalQuantity, // Assign the calculated total
      };
    });

    res.status(200).json({
      success: true,
      data: updatedArrivals,
    });
    
  } catch (error) {
    console.log("Error fetching arrivals", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getArrival = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const arrival = await prisma.arrival.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });

    if (!arrival) {
      return res.status(404).json({
        success: false,
        message: "Arrival not found",
      });
    }

    res.status(200).json({
      success: true,
      data: arrival,
    });
  } catch (error) {
    console.log("Error fetching arrival", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createArrival = async (req: Request, res: any) => {
  try {
    const arrivalNumber = await getNextArrivalNumber();
    const {
      title,
      supplier,
      expectedArrivalDate,
      expected_pallets,
      expected_boxes,
      expected_kilograms,
      expected_quantity,
    } = req.body;

    if (
      !title ||
      !supplier ||
      !expectedArrivalDate ||
      !expected_pallets ||
      !expected_boxes ||
      !expected_kilograms ||
      !expected_quantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, supplier, arrivalDate, expected_pallets, expected_boxes, expected_kilograms & expected_quantity are required",
      });
    }

    const arrival = await prisma.arrival.create({
      data: {
        arrivalNumber,
        title,
        supplier,
        expectedArrivalDate,
        expected_pallets,
        expected_boxes,
        expected_kilograms,
        expected_quantity,
      },
    });

    res.status(201).json({
      success: true,
      data: arrival,
    });
  } catch (error) {
    console.log("Error creating arrival", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateArrival = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const {
      title,
      expectedArrivalDate,
      supplier,
      expected_pallets,
      expected_boxes,
      expected_kilograms,
      actual_pallets,
      actual_boxes,
      actual_kilograms,
      expected_quantity,
      status,
      actualArrivalDate,
      finishDate,
      products,
    } = req.body;

    if (!expectedArrivalDate || !supplier || !title) {
      return res.status(400).json({
        success: false,
        message: "Title, supplier and arrivalDate are required",
      });
    }

    if (
      !expected_pallets &&
      !expected_boxes &&
      !expected_kilograms &&
      !expected_quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "All are required: pallets, boxes, kilograms & quantity",
      });
    }

    const arrivalExists = await prisma.arrival.findUnique({
      where: {
        id,
      },
    });

    if (!arrivalExists) {
      return res.status(404).json({
        success: false,
        message: "Arrival not found",
      });
    }

    const arrival = await prisma.arrival.update({
      where: {
        id,
      },
      data: {
        title,
        supplier,
        expectedArrivalDate,
        expected_pallets,
        expected_boxes,
        expected_quantity,
        expected_kilograms,
        actual_pallets,
        actual_boxes,
        actual_kilograms,
        status,
        actualArrivalDate,
        finishDate,
      },
    });

    res.status(200).json({
      success: true,
      data: arrival,
    });
  } catch (error) {
    console.log("Error updating arrival", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteArrival = async (req: Request, res: any) => {
  try {
    const { id } = req.params;

    const arrivalExists = await prisma.arrival.findUnique({
      where: {
        id,
      },
    });

    if (!arrivalExists) {
      return res.status(404).json({
        success: false,
        message: "Arrival not found",
      });
    }

    await prisma.arrival.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Arrival deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting arrival", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
