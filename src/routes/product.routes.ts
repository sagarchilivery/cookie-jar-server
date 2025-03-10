// src/routes/arrival.routes.ts

import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getLastSavedProduct,
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.post("/get-last-saved-product", getLastSavedProduct);

export default router;
