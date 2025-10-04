import { format } from "date-fns";

export const formatDate = (dateString: Date | null | undefined) => {
  if (!dateString) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

export const formatDateWithoutYear = (dateString: Date | null | undefined) => {
  if (!dateString) return "";

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

export function formatDateToYYYYMMDD(date: Date) {
  return format(new Date(date), "yyyy-MM-dd");
}
