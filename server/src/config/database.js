import neo4j from "neo4j-driver";

const { COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD } = process.env;

if (!COGNODB_URI || !COGNODB_USERNAME || !COGNODB_PASSWORD) {
  throw new Error("CognoDB environment variables are missing.");
}

const driver = neo4j.driver(
  COGNODB_URI,
  neo4j.auth.basic(COGNODB_USERNAME, COGNODB_PASSWORD),
  { maxConnectionLifetime: 3600 }
);

export default driver;