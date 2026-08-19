import { executeQuery } from "../services/graphService.js";
import { recommendationsQuery, learningPathQuery } from "../queries/recommendationQueries.js";

export async function getRecommendations(req, res) {
  try {
    const result = await executeQuery(recommendationsQuery, { developerId: req.params.id });

    const data = result.records.map(record => {
      const matchedSkills = record.get("matchedSkills").map(skill => skill.properties);
      const requiredSkills = record.get("requiredSkills").map(skill => skill.properties);
      const matchedIds = new Set(matchedSkills.map(skill => skill.id));
      const missingSkills = requiredSkills.filter(skill => !matchedIds.has(skill.id));

      return {
        project: record.get("p").properties,
        matchedSkills,
        requiredSkills,
        missingSkills,
        matchedCount: record.get("matchedCount").toNumber(),
        requiredCount: record.get("requiredCount").toNumber()
      };
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: "Unable to generate recommendations." });
  }
}

export async function getLearningPath(req, res) {
  try {
    const result = await executeQuery(learningPathQuery, { developerId: req.params.id });

    res.json(result.records.map(record => ({
      skill: record.get("candidate").properties,
      relevance: record.get("relevance").toNumber()
    })));
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: "Unable to generate learning path." });
  }
}