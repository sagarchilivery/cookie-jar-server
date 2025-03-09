import { Request, Response } from "express";
import { prisma } from "../config/db";
import { Cypher, Decypher } from "../utils/cypher-dicpher";
import { CreateTokens } from "../utils/create-token";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, username } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const doesUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (doesUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: Cypher(password),
        username,
      },
    });

    const { accessToken } = CreateTokens({
      id: newUser.id,
      role: newUser.role,
      email: newUser.email,
    });

    res.setHeader("accessToken", accessToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });

    const { password: userPassword, ...user } = newUser;

    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isgenuineUser = Decypher({ password, hash: user.password });

    if (!isgenuineUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken } = CreateTokens({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    res.setHeader("accessToken", accessToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });

    const { password: userPassword, ...userData } = user;

    return res.status(200).json({ success: true, data: userData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("accessToken");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
