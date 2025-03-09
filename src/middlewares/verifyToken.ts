// src/middlewares/verifyToken.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  id?: string;
  role?: string;
  email?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies["accessToken"];

  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (token && secret) {
    const decode = jwt.verify(token, secret);
    req.id = (decode as JwtPayload)._id;
    req.role = (decode as JwtPayload).role;
    req.email = (decode as JwtPayload).email;

    next();
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export { verifyToken };
