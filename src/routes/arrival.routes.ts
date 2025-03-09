import express from "express";
import {
  createArrival,
  getAllArrivals,
  getArrival,
  updateArrival,
} from "../controllers/arrival.controller";

const router = express.Router();

router.get("/", getAllArrivals);
router.get("/:id", getArrival);
router.post("/", createArrival);
router.patch("/:id", updateArrival);

export default router;
