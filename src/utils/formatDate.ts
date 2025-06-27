export const formatDate = (isoString?: string): string => {
  if (!isoString) return "-";

  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
