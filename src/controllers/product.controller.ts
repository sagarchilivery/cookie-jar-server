// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { prisma } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const generateNewSKU = () => {
  return `SKU-${uuidv4()}`;
};

// export const createProduct = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const {
//       barcode,
//       brandName,
//       productName,
//       description,
//       category,
//       size,
//       color,
//       style,
//       condition,
//       quantity,
//       arrivalId,
//       added,
//     } = req.body;

//     if (!added) {
//       if (!productName || !brandName || !arrivalId) {
//         return res.status(400).json({
//           success: false,
//           message: "Required: Brand & product name, arrivalId",
//         });
//       }

//       const doesBrandExist = await prisma.brand.findUnique({
//         where: {
//           name: brandName,
//         },
//       });

//       if (!doesBrandExist) {
//         return res.status(400).json({
//           success: false,
//           message: "Brand does not exist",
//         });
//       }

//       const doesProductExist = await prisma.product.findFirst({
//         where: {
//           name: productName,
//           brandId: doesBrandExist.id,
//           arrivalId,
//           added: false,
//         },
//       });

//       if (doesProductExist) {
//         if (
//           color ||
//           size ||
//           description ||
//           condition ||
//           quantity ||
//           style ||
//           category ||
//           barcode
//         ) {
//           const updatedProduct = await prisma.product.update({
//             where: { id: doesProductExist.id },
//             data: {
//               color: color || doesProductExist.color,
//               size: size || doesProductExist.size,
//               description: description || doesProductExist.description,
//               condition: condition || doesProductExist.condition,
//               quantity: quantity || doesProductExist.quantity,
//               style: style || doesProductExist.style,
//               category: category || doesProductExist.category,
//               barcode: barcode || doesProductExist.barcode,
//               name: productName || doesProductExist.name,

//             },
//           });
//           return res.status(200).json({
//             success: true,
//             message: "Product updated",
//             data: updatedProduct,
//           });
//         }
//         return res.status(200).json({
//           success: true,
//           message: "Saved successfully",
//           data: doesProductExist,
//         });
//       } else {
//         const newProductOnlySave = await prisma.product.create({
//           data: {
//             barcode,
//             name: productName,
//             description,
//             brandId: doesBrandExist.id,
//             category,
//             size: size || null,
//             color: color || null,
//             style,
//             condition,
//             quantity,
//             arrivalId,
//             sku: generateNewSKU(),
//             added: false,
//           },
//         });

//         return res.status(201).json({
//           success: true,
//           message: "Product saved",
//           data: newProductOnlySave,
//         });
//       }
//     }

//     if (
//       !brandName ||
//       !productName ||
//       !condition ||
//       !quantity ||
//       !arrivalId ||
//       !category ||
//       !style
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Required: Brand & product name, condition, quantity, arrivalId, category, style",
//       });
//     }

//     const doesArrivalExist = await prisma.arrival.findUnique({
//       where: {
//         id: arrivalId,
//       },
//     });

//     if (!doesArrivalExist) {
//       return res.status(400).json({
//         success: false,
//         message: "Arrival does not exist",
//       });
//     }

//     const doesBrandExist = await prisma.brand.findUnique({
//       where: {
//         name: brandName,
//       },
//     });

//     if (!doesBrandExist) {
//       return res.status(400).json({
//         success: false,
//         message: "Brand does not exist",
//       });
//     }

//     if (quantity < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Quantity must be at least 1",
//       });
//     }

//     const existingProduct = await prisma.product.findFirst({
//       where: {
//         name: productName,
//         brandId: doesBrandExist.id,
//         category,
//         size: size || null,
//         color: color || null,
//         style,
//         condition,
//         added: true,
//       },
//     });

//     if (existingProduct) {
//       if (existingProduct.arrivalId === arrivalId) {
//         const updatedProduct = await prisma.product.update({
//           where: { id: existingProduct.id },
//           data: {
//             quantity: { increment: quantity },
//           },
//         });

//         return res.status(200).json({
//           success: true,
//           message: "Product quantity updated",
//           data: updatedProduct,
//         });
//       } else {
//         const newProduct = await prisma.product.create({
//           data: {
//             barcode,
//             name: productName,
//             description,
//             brandId: doesBrandExist.id,
//             category,
//             size: size || null,
//             color: color || null,
//             style,
//             condition,
//             quantity,
//             arrivalId,
//             added: true,
//             sku: generateNewSKU(),
//           },
//         });

//         return res.status(201).json({
//           success: true,
//           message: "New product created with new SKU",
//           data: newProduct,
//         });
//       }
//     } else {
//       const newProduct = await prisma.product.create({
//         data: {
//           barcode,
//           name: productName,
//           description,
//           brandId: doesBrandExist.id,
//           category,
//           size: size || null,
//           color: color || null,
//           style,
//           condition,
//           quantity,
//           arrivalId,
//           added: true,
//           sku: generateNewSKU(),
//         },
//       });

//       return res.status(201).json({
//         success: true,
//         message: "New product created with new SKU",
//         data: newProduct,
//       });
//     }
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      barcode,
      brandName,
      productName,
      description,
      category,
      size,
      color,
      style,
      condition,
      quantity,
      arrivalId,
      added,
    } = req.body;

    if (!added) {
      // Auto-save: Ensure brandName, productName, and arrivalId exist
      if (!productName || !brandName || !arrivalId) {
        return res.status(400).json({
          success: false,
          message: "Required: Brand & product name, arrivalId",
        });
      }

      // Check if brand exists
      const brand = await prisma.brand.findUnique({
        where: { name: brandName },
      });

      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Brand does not exist",
        });
      }

      // Find existing product for the same arrivalId
      const existingProduct = await prisma.product.findFirst({
        where: {
          arrivalId,
          added: false,
        },
      });

      if (existingProduct) {
        // Update only allowed fields (except arrivalId)
        const updatedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: productName,
            brandId: brand.id,
            barcode: barcode || existingProduct.barcode,
            description: description || existingProduct.description,
            category: category || existingProduct.category,
            size: size || existingProduct.size,
            color: color || existingProduct.color,
            style: style || existingProduct.style,
            condition: condition || existingProduct.condition,
            quantity: quantity || existingProduct.quantity,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Product updated",
          data: updatedProduct,
        });
      } else {
        // Create new auto-saved product
        const newProduct = await prisma.product.create({
          data: {
            barcode,
            name: productName,
            description,
            brandId: brand.id,
            category,
            size,
            color,
            style,
            condition,
            quantity,
            arrivalId,
            sku: generateNewSKU(),
            added: false,
          },
        });

        return res.status(201).json({
          success: true,
          message: "Product saved",
          data: newProduct,
        });
      }
    }

    // If `added: true`, proceed with the regular product creation process
    if (
      !brandName ||
      !productName ||
      !condition ||
      !quantity ||
      !arrivalId ||
      !category ||
      !style
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required: Brand & product name, condition, quantity, arrivalId, category, style",
      });
    }

    // Check if arrival exists
    const arrival = await prisma.arrival.findUnique({
      where: { id: arrivalId },
    });

    if (!arrival) {
      return res.status(400).json({
        success: false,
        message: "Arrival does not exist",
      });
    }

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand does not exist",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check if product exists with `added: true`
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: productName,
        brandId: brand.id,
        category,
        size,
        color,
        style,
        condition,
        added: true,
      },
    });

    if (existingProduct) {
      if (existingProduct.arrivalId === arrivalId) {
        // Update quantity for the same arrival
        const updatedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: { quantity: { increment: quantity } },
        });

        return res.status(200).json({
          success: true,
          message: "Product quantity updated",
          data: updatedProduct,
        });
      } else {
        // Create new product with a new SKU
        const newProduct = await prisma.product.create({
          data: {
            barcode,
            name: productName,
            description,
            brandId: brand.id,
            category,
            size,
            color,
            style,
            condition,
            quantity,
            arrivalId,
            added: true,
            sku: generateNewSKU(),
          },
        });

        return res.status(201).json({
          success: true,
          message: "New product created with new SKU",
          data: newProduct,
        });
      }
    } else {
      // Create new product
      const newProduct = await prisma.product.create({
        data: {
          barcode,
          name: productName,
          description,
          brandId: brand.id,
          category,
          size,
          color,
          style,
          condition,
          quantity,
          arrivalId,
          added: true,
          sku: generateNewSKU(),
        },
      });

      return res.status(201).json({
        success: true,
        message: "New product created with new SKU",
        data: newProduct,
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
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

export const getLastSavedProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { arrivalId, productName, brandName } = req.body;

    if (!arrivalId || !productName || !brandName) {
      return res.status(400).json({
        success: false,
        message: "Required: Brand name, product name, and arrivalId",
      });
    }

    // Find the brand first
    const brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand does not exist",
      });
    }

    // Get the last saved (added: false) product
    const product = await prisma.product.findFirst({
      where: {
        arrivalId,
        name: productName,
        brandId: brand.id, // Use brandId instead of querying brand.name
        added: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No saved product found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching last saved product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
