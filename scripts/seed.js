import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USERNAME, process.env.COGNODB_PASSWORD)
);

const session = driver.session();

const developers = [
  {
    id: "dev-1",
    name: "Murali Grandhi",
    email: "murali@gmail.com",
    experience: "Junior"
  },
  {
    id: "dev-2",
    name: "Tejaswi",
    email: "tejaswi@gmail.com",
    experience: "Junior"
  },
  {
    id: "dev-3",
    name: "Chaithu",
    email: "chaithu@gmail.com",
    experience: "Fresher"
  },
  {
    id: "dev-4",
    name: "Uma",
    email: "uma@gmail.com",
    experience: "Mid-level"
  },
  {
    id: "dev-5",
    name: "Venky",
    email: "venky@gmail.com",
    experience: "Mid-Level"
  }
];
const skills = [
  ["skill-js", "JavaScript", "Programming"], ["skill-react", "React.js", "Frontend"],
  ["skill-node", "Node.js", "Backend"], ["skill-express", "Express.js", "Backend"],
  ["skill-mongo", "MongoDB", "Database"], ["skill-rest", "REST APIs", "Backend"],
  ["skill-git", "Git", "Tools"], ["skill-ai", "Generative AI", "AI"],
  ["skill-python", "Python", "Programming"], ["skill-sql", "SQL", "Database"],
  ["skill-next", "Next.js", "Frontend"], ["skill-typescript", "TypeScript", "Programming"],
  ["skill-docker", "Docker", "DevOps"], ["skill-testing", "Automated Testing", "Quality"],
  ["skill-redis", "Redis", "Database"]
].map(([id, name, category]) => ({ id, name, category }));

const technologies = [
  ["tech-react", "React"], ["tech-node", "Node.js"], ["tech-express", "Express"],
  ["tech-mongo", "MongoDB"], ["tech-postgres", "PostgreSQL"], ["tech-docker", "Docker"],
  ["tech-vercel", "Vercel"], ["tech-render", "Render"], ["tech-cognodb", "CognoDB"]
].map(([id, name]) => ({ id, name }));

const companies = [
  ["company-wexa", "Wexa"], ["company-acme", "Acme Technologies"], ["company-nova", "Nova Systems"]
].map(([id, name]) => ({ id, name }));

const projects = [
  { id: "project-ai-resume", name: "AI Resume Reviewer", description: "AI-powered resume and portfolio analysis platform.", difficulty: "Intermediate" },
  { id: "project-commerce", name: "E-Commerce Platform", description: "Full-stack shopping platform with authentication and APIs.", difficulty: "Intermediate" },
  { id: "project-portfolio", name: "Developer Portfolio", description: "Modern portfolio application with project and contact sections.", difficulty: "Beginner" },
  { id: "project-analytics", name: "Developer Analytics Dashboard", description: "Dashboard for developer activity and project insights.", difficulty: "Intermediate" },
  { id: "project-ai-chat", name: "AI Knowledge Assistant", description: "Conversational application backed by generative AI.", difficulty: "Advanced" }
];

const developerSkills = {
  "dev-1": ["skill-js", "skill-react", "skill-node", "skill-express", "skill-mongo", "skill-rest", "skill-git"],
  "dev-2": ["skill-js", "skill-react", "skill-next", "skill-typescript", "skill-git"],
  "dev-3": ["skill-js", "skill-node", "skill-express", "skill-sql", "skill-redis", "skill-docker"],
  "dev-4": ["skill-python", "skill-ai", "skill-sql", "skill-docker", "skill-testing"],
  "dev-5": ["skill-js", "skill-react", "skill-node", "skill-python", "skill-git"]
};

const projectRequirements = {
  "project-ai-resume": ["skill-react", "skill-node", "skill-mongo", "skill-ai"],
  "project-commerce": ["skill-js", "skill-react", "skill-node", "skill-express", "skill-mongo"],
  "project-portfolio": ["skill-js", "skill-react", "skill-git"],
  "project-analytics": ["skill-react", "skill-node", "skill-sql", "skill-docker"],
  "project-ai-chat": ["skill-node", "skill-python", "skill-ai", "skill-redis"]
};

const projectTechnologies = {
  "project-ai-resume": ["tech-react", "tech-node", "tech-mongo", "tech-cognodb"],
  "project-commerce": ["tech-react", "tech-node", "tech-express", "tech-mongo"],
  "project-portfolio": ["tech-react", "tech-vercel"],
  "project-analytics": ["tech-react", "tech-node", "tech-postgres", "tech-docker"],
  "project-ai-chat": ["tech-node", "tech-docker", "tech-cognodb"]
};

const developerProjects = {
  "dev-1": ["project-portfolio", "project-commerce"],
  "dev-2": ["project-portfolio"],
  "dev-3": ["project-commerce", "project-analytics"],
  "dev-4": ["project-ai-chat", "project-analytics"],
  "dev-5": ["project-portfolio", "project-ai-resume"]
};

const developerCompanies = {
  "dev-1": "company-wexa", "dev-2": "company-acme", "dev-3": "company-acme",
  "dev-4": "company-nova", "dev-5": "company-wexa"
};

const relatedSkills = [
  ["skill-react", "skill-next"], ["skill-react", "skill-typescript"],
  ["skill-node", "skill-express"], ["skill-node", "skill-rest"],
  ["skill-python", "skill-ai"], ["skill-ai", "skill-python"],
  ["skill-node", "skill-docker"], ["skill-react", "skill-testing"],
  ["skill-sql", "skill-redis"]
];

const relatedTechnologies = [
  ["tech-react", "tech-vercel"], ["tech-node", "tech-express"],
  ["tech-node", "tech-docker"], ["tech-mongo", "tech-node"],
  ["tech-cognodb", "tech-node"]
];

try {
  await session.run("MATCH (n) DETACH DELETE n");

  await session.run("UNWIND $rows AS row CREATE (d:Developer) SET d = row", { rows: developers });
  await session.run("UNWIND $rows AS row CREATE (s:Skill) SET s = row", { rows: skills });
  await session.run("UNWIND $rows AS row CREATE (t:Technology) SET t = row", { rows: technologies });
  await session.run("UNWIND $rows AS row CREATE (c:Company) SET c = row", { rows: companies });
  await session.run("UNWIND $rows AS row CREATE (p:Project) SET p = row", { rows: projects });

  for (const [developerId, skillIds] of Object.entries(developerSkills)) {
    await session.run(
      "MATCH (d:Developer {id: $developerId}) UNWIND $skillIds AS skillId MATCH (s:Skill {id: skillId}) CREATE (d)-[:KNOWS]->(s)",
      { developerId, skillIds }
    );
  }

  for (const [projectId, skillIds] of Object.entries(projectRequirements)) {
    await session.run(
      "MATCH (p:Project {id: $projectId}) UNWIND $skillIds AS skillId MATCH (s:Skill {id: skillId}) CREATE (p)-[:REQUIRES]->(s)",
      { projectId, skillIds }
    );
  }

  for (const [projectId, technologyIds] of Object.entries(projectTechnologies)) {
    await session.run(
      "MATCH (p:Project {id: $projectId}) UNWIND $technologyIds AS technologyId MATCH (t:Technology {id: technologyId}) CREATE (p)-[:BUILT_WITH]->(t)",
      { projectId, technologyIds }
    );
  }

  for (const [developerId, projectIds] of Object.entries(developerProjects)) {
    await session.run(
      "MATCH (d:Developer {id: $developerId}) UNWIND $projectIds AS projectId MATCH (p:Project {id: projectId}) CREATE (d)-[:WORKED_ON]->(p)",
      { developerId, projectIds }
    );
  }

  for (const [developerId, companyId] of Object.entries(developerCompanies)) {
    await session.run(
      "MATCH (d:Developer {id: $developerId}) MATCH (c:Company {id: $companyId}) CREATE (d)-[:WORKS_AT]->(c)",
      { developerId, companyId }
    );
  }

  for (const [fromId, toId] of relatedSkills) {
    await session.run(
      "MATCH (a:Skill {id: $fromId}) MATCH (b:Skill {id: $toId}) CREATE (a)-[:RELATED_TO]->(b)",
      { fromId, toId }
    );
  }

  for (const [fromId, toId] of relatedTechnologies) {
    await session.run(
      "MATCH (a:Technology {id: $fromId}) MATCH (b:Technology {id: $toId}) CREATE (a)-[:RELATED_TO]->(b)",
      { fromId, toId }
    );
  }

  console.log("CognoDB seed completed.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await session.close();
  await driver.close();
}