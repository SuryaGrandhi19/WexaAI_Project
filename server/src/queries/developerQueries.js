export const developersQuery = `
MATCH (d:Developer)
RETURN d
ORDER BY d.name
`;

export const developerQuery = `
MATCH (d:Developer {id: $developerId})
OPTIONAL MATCH (d)-[:KNOWS]->(s:Skill)
RETURN d, collect(s) AS skills
`;