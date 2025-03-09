// src/middlewares/verifyManager.ts

import { NextFunction, Response } from "express";
import { CustomRequest } from "./verifyToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyManager = (
  req: CustomRequest,
  res: any,
  next: NextFunction
) => {
  const token =
  req.headers["authorization"]?.split(" ")[1] || req.cookies["accessToken"];
  
  console.log('token: ', token);
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (token && secret) {
    const decode = jwt.verify(token, secret);
    console.log('decode: ', decode);
    req.id = (decode as JwtPayload)._id;
    req.role = (decode as JwtPayload).role;
    req.email = (decode as JwtPayload).email;

    if (req.role === "MANAGER") {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Access denied" });
  }
};

export { verifyManager };
