import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = "mYSuperSecret";

// Extend Express Request type to include a `user` property.
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction):void{
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is missing!" });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    const decoded = jwt.verify(token, SECRET);

    // Attach decoded payload to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid or expired token!" });
    return;
  }
}

export default authMiddleware;