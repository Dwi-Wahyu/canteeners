export function convertSecondsToFormattedTime(totalSeconds: number | null) {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) {
    return "0'0";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `'${minutes}'${seconds}`;
  } else {
    return `${seconds}\'`;
  }
}
