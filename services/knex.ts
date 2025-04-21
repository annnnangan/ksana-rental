import Knex from "knex";
const config = require("../knexfile");

declare global {
  let knexInstance: ReturnType<typeof Knex> | undefined;
}

const knexConfig = config[process.env.NODE_ENV || "development"];

//@ts-expect-error expected
export const knex = globalThis.knexInstance ?? Knex(knexConfig);

if (process.env.NODE_ENV !== "production") {
  //@ts-expect-error expected
  globalThis.knexInstance = knex;
}
