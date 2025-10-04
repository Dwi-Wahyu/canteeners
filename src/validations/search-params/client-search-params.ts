import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const ClientSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
});

export type ClientSearchParamsType = {
  page: number;
  perPage: number;
  name: string;
};
