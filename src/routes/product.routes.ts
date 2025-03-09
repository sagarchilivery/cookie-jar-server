// src/routes/arrival.routes.ts

import { Router } from "express";
import { createProduct, getAllProducts } from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);

export default router;
