import express from "express";
import {
  createArrival,
  deleteArrival,
  getAllArrivals,
  getArrival,
  updateArrival,
} from "../controllers/arrival.controller";
import { verifyManager } from "../middlewares/verifyManager";

const router = express.Router();

router.get("/", getAllArrivals);
router.get("/:id", getArrival);
router.post("/", verifyManager, createArrival);
router.patch("/:id", updateArrival);
router.delete("/:id", verifyManager, deleteArrival);

export default router;
