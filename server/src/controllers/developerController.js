import { executeQuery } from "../services/graphService.js";
import { developersQuery, developerQuery } from "../queries/developerQueries.js";

export async function listDevelopers(req, res) {
  try {
    const result = await executeQuery(developersQuery);
    res.json(result.records.map(record => record.get("d").properties));
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: "Database is currently unavailable." });
  }
}

export async function getDeveloper(req, res) {
  try {
    const result = await executeQuery(developerQuery, { developerId: req.params.id });

    if (!result.records.length) {
      return res.status(404).json({ message: "Developer not found." });
    }

    const record = result.records[0];

    res.json({
      developer: record.get("d").properties,
      skills: record.get("skills").filter(Boolean).map(skill => skill.properties)
    });
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: "Unable to load developer data." });
  }
}