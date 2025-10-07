import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to database"))
.catch(err => console.error("Database connection error:", err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
