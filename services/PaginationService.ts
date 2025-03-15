import { knex } from "@/services/knex";
import { Knex } from "knex";

export class PaginationService {
  constructor(private knex: Knex) {}

  paginateQuery = (query: Knex.QueryBuilder, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return query.offset(offset).limit(limit);
  };
}

export const paginationService = new PaginationService(knex);
