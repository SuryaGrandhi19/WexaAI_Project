import express from "express";
import { getRecommendations, getLearningPath } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/developers/:id/recommendations", getRecommendations);
router.get("/developers/:id/learning-path", getLearningPath);

export default router;