import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    return;
  }

  const parts = authHeader.split(" ");
  const token = parts[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized: Malformed token." });
    return;
  }

  const secret: string = process.env.JWT_SECRET || "fallback_secret";

  try {
    const decoded = jwt.verify(token, secret) as unknown as { id: string; email: string; name: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
  }
};
