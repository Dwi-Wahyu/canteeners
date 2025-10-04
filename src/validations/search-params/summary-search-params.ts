import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const SummarySearchParams = createSearchParamsCache({
  year: parseAsString.withDefault("2025"),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
});

export type SummarySearchParamsType = {
  year: string;
  from: string;
  to: string;
};
