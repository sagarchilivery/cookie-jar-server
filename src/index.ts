// Desc: Main entry point for the application
// src/index.ts

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ensureSequenceExists, prisma } from "./config/db";

const app = express();
const port = process.env.PORT || 1337;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("OK");
});

import arrivalRoutes from "./routes/arrival.routes";
import productRoutes from "./routes/product.routes";
import brandRoutes from "./routes/brand.routes";

app.use("/api/arrival", arrivalRoutes);
app.use("/api/product", productRoutes);
app.use("/api/brand", brandRoutes);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  await prisma.$connect();
  console.log("Database connected.");

  // Ensure arrival_number_seq exists
  await ensureSequenceExists();
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected. Server shutting down.");
  process.exit(0);
});
