import { verifyDatabase } from "../services/graphService.js";

export async function health(req, res) {
  try {
    const database = await verifyDatabase();
    res.json({ status: "ok", database: database ? "connected" : "unavailable" });
  } catch (error) {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
}