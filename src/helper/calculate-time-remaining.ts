export const calculateTimeRemaining = (targetTimeMs: number) => {
  const nowMs = new Date().getTime();
  const differenceMs = targetTimeMs - nowMs;

  if (differenceMs <= 0) {
    return "Selesai";
  }

  const totalSeconds = Math.floor(differenceMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const calculateOrderEstimationRemainining = ({
  estimation,
  processed_at,
}: {
  processed_at: Date;
  estimation: number;
}) => {
  const targetTimeMs = processed_at
    ? new Date(processed_at).getTime() + estimation * 60 * 1000
    : 0;

  const nowMs = new Date().getTime();
  const differenceMs = targetTimeMs - nowMs;

  if (differenceMs <= 0) {
    return "Selesai";
  }

  const totalSeconds = Math.floor(differenceMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
