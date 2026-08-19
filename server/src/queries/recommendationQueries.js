export const recommendationsQuery = `
MATCH (d:Developer {id: $developerId})-[:KNOWS]->(known:Skill)<-[:REQUIRES]-(p:Project)
WITH p, collect(DISTINCT known) AS matchedSkills
MATCH (p)-[:REQUIRES]->(required:Skill)
WITH p, matchedSkills, collect(DISTINCT required) AS requiredSkills
RETURN p, matchedSkills, requiredSkills,
       size(matchedSkills) AS matchedCount,
       size(requiredSkills) AS requiredCount
ORDER BY matchedCount DESC, p.name
LIMIT 10
`;

export const learningPathQuery = `
MATCH (d:Developer {id: $developerId})-[:KNOWS]->(known:Skill)-[:RELATED_TO]->(candidate:Skill)
WHERE NOT (d)-[:KNOWS]->(candidate)
RETURN candidate, count(*) AS relevance
ORDER BY relevance DESC, candidate.name
LIMIT 10
`;