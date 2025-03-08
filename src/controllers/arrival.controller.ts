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

    res.status(200).json({
      success: true,
      data: arrivals,
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
      expected_pieces,
    } = req.body;

    if (!expectedArrivalDate || !supplier || !title) {
      return res.status(400).json({
        success: false,
        message: "Title, supplier and arrivalDate are required",
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
        expected_pieces,
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
      expected_pieces,
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
      !expected_pieces
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one of the following is required: pallets, boxes, kilograms, pieces",
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
        expected_kilograms,
        expected_pieces,
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
