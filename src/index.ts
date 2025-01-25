import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import connectDB from "./db";
import { UserModel } from "./model/User";
import { userSchema } from "./validations/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware";

const app = express();
app.use(express.json());

connectDB();

const SECRET = "mYSuperSecret";

// Sign-In Route
app.post("/api/v1/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required!" });
      return;
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "Incorrect Username!" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Password not set for this user!" });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      res.status(400).json({ message: "Incorrect Password!" });
      return;
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
}
);

// Sign-Up Route
app.post(
  "/api/v1/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required!" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword };

      const parsedData = userSchema.parse(newUser);

      await UserModel.create(parsedData);

      res.status(201).json({ message: "User signed up successfully!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof mongoose.Error) {
        res.status(409).json({ message: "User already exists!" });
        return;
      }

      console.error("Sign-Up Error:", error);
      res.status(500).json({ message: "Internal server error!" });
    }
  }
);


app.post("/api/v1/content", authMiddleware, (req, res) => {
  const user = (req as any).user; // Type-safe access to the `user` property
  res.status(200).json({ message: "Authorized access", user });});

app.get("/api/v1/content", (req, res) => {
  res.status(501).json({ message: "Get content endpoint not implemented yet." });
});

app.delete("/api/v1/content", (req, res) => {
  res.status(501).json({ message: "Delete content endpoint not implemented yet." });
});

// Brain Share Routes (Placeholder)
app.post("/api/v1/brain/share", (req, res) => {
  res.status(501).json({ message: "Brain share endpoint not implemented yet." });
});

app.get("/api/v1/brain/:shareLink", (req, res) => {
  res.status(501).json({ message: "Get brain share endpoint not implemented yet." });
});

// Start the Server
app.listen(3000, () => {
  console.log("Server Running on http://localhost:3000");
});