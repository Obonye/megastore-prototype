import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/db/schema"

if (process.env.NODE_ENV !== "production") {
  config({ override: true })
}

declare global {
  var dbClient: postgres.Sql | undefined
}

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.")
  }

  const client = globalThis.dbClient ?? postgres(databaseUrl)

  if (process.env.NODE_ENV !== "production") {
    globalThis.dbClient = client
  }

  return drizzle(client, { schema })
}
