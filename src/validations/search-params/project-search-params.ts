import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const ProjectSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  year: parseAsString.withDefault(""),
  regional: parseAsString.withDefault(""),
});

export type ProjectSearchParamsType = {
  page: number;
  perPage: number;
  name: string;
  category: string;
  year: string;
  regional: string;
};

export const ProjectProgressSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
  project_id: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  priority: parseAsString.withDefault(""),
  worker_id: parseAsString.withDefault(""),
});

export type ProjectProgressSearchParamsType = {
  page: number;
  perPage: number;
  name: string;
  project_id: string;
  status: string;
  priority: string;
  worker_id: string;
};
