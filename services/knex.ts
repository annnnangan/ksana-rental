import Knex from "knex";
const config = require("../knexfile");

declare global {
  let knexInstance: ReturnType<typeof Knex> | undefined;
}

const knexConfig = config[process.env.NODE_ENV || "development"];

export const knex = globalThis.knexInstance ?? Knex(knexConfig);

if (process.env.NODE_ENV !== "production") {
  globalThis.knexInstance = knex;
}
