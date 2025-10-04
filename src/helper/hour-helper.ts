import { format } from "date-fns";

export function formatToHour(date: Date | null) {
  if (!date) {
    return "-"; // atau string lain yang sesuai, misalnya "--:--"
  }
  return format(date, "HH:mm");
}
