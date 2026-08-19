import "dotenv/config";
import express from "express";
import cors from "cors";
import developerRoutes from "./routes/developerRoutes.js";
import graphRoutes from "./routes/graphRoutes.js";
import { health } from "./controllers/healthController.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "DevGraph API", status: "running" });
});

app.get("/api/health", health);
app.use("/api/developers", developerRoutes);
app.use("/api", graphRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`DevGraph API running on port ${port}`);
});