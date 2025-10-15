import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Inspora API",
    status: "running",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Sorry, we couldn't find what you're looking for." });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Oops! Something went wrong on our side. Please try again later." });
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error("Database connection error:", err));