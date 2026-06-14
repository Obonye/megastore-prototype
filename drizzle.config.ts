import "dotenv/config"

import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL
const isGenerateCommand = process.argv.some((arg) => arg.includes("generate"))

if (!databaseUrl && !isGenerateCommand) {
  throw new Error("DATABASE_URL is required to run Drizzle commands.")
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl ?? "",
  },
})
