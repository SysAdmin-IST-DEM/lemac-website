import { defineConfig, env } from "prisma/config";
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
