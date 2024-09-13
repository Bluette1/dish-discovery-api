import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import categories from "./routes/categories";
import auth from "./routes/auth";
import users from "./routes/users";
import { logger } from "./logger";
import bodyParser from "body-parser";
import morganMiddleware from "./morgan";

dotenv.config();

const app = express();
// Use Morgan for HTTP request logging
app.use(morganMiddleware);

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dishdiscovery";

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req: Request, res: Response) => {
  logger.info("Hello world requested");
  res.send("Hello, World!");
});

app.use("/", categories);
app.use("/", auth);
app.use("/", users);

// Middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Not Found");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error using Winston
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

  // Send a generic error response
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
