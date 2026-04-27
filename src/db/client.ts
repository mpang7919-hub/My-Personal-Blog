import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to use the MySQL database.");
  }

  return databaseUrl;
}

export function getDb() {
  return drizzle({
    connection: {
      uri: getDatabaseUrl(),
    },
    schema,
    mode: "default",
  });
}

export type DatabaseClient = ReturnType<typeof getDb>;
