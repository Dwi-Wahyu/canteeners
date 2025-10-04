import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const MaterialSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
});

export type MaterialSearchParamsType = {
  page: number;
  perPage: number;
  name: string;
};
