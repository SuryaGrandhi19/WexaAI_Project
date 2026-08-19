import driver from "../config/database.js";

export async function executeQuery(query, params = {}) {
  const session = driver.session();
  try {
    return await session.run(query, params);
  } finally {
    await session.close();
  }
}

export async function verifyDatabase() {
  const result = await executeQuery("RETURN 1 AS ok");
  return result.records[0].get("ok").toNumber() === 1;
}