// src/routes/arrival.routes.ts

import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getLastSavedProduct,
  getProductsofArrival,
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.post("/get-last-saved-product", getLastSavedProduct);
router.get("/:id", getProductsofArrival)

export default router;
