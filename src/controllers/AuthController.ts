import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";

interface LoginPayloadType {
  name: string;
  email: string;
  oauth_id: string;
  provider: string;
  image: string;
}

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const body: LoginPayloadType = req.body;

      let findUser = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!findUser) {
        findUser = await prisma.user.create({
          data: {
            name: body.name,
            email: body.email,
            oauth_id: body.oauth_id,
            provider: body.provider,
            image: body.image,
          },
        });
      }

      const JWTPayload = {
        name: body.name ?? "User",
        email: body.email,
        id: findUser.id,
      };

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET not defined");
      }

      const token = jwt.sign(JWTPayload, secret, {
        expiresIn: "365d",
      });

      return res.json({
        message: "Logged in successfully!",
        user: {
          ...findUser,
          token: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again!",
      });
    }
  }
}

export default AuthController;
