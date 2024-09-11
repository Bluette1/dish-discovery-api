import express, { Request, Response } from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "./logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticateToken, authorizeAdmin } from "./authmiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dishdiscovery'

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const users = [
  {
    id: 1,
    username: "user",
    password: bcrypt.hashSync("password", 10),
    role: "user",
  },
  {
    id: 2,
    username: "admin",
    password: bcrypt.hashSync("adminpass", 10),
    role: "admin",
  },
];

const secretKey = "your_secret_key";

// Login route
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secretKey);
  res.json({ token });
});

// Protected route for basic users
app.get("/user", authenticateToken, (req: Request, res: Response) => {
  res.send("Welcome, user!");
});

// Protected route for admin users
app.get("/admin", authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
  res.send("Welcome, admin!");
});

app.get("/", (req: Request, res: Response) => {
  logger.info("Hello world requested");
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
