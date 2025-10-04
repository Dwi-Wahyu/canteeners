import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const UserSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  nama: parseAsString.withDefault(""),
  role: parseAsString.withDefault(""),
});

export type UserSearchParamsType = {
  page: number;
  perPage: number;
  nama: string;
  role: string;
};
