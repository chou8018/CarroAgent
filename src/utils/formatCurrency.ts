export const formatCurrency = (amount?: string | number): string => {
  if (!amount) return "-";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  return `RM ${num.toLocaleString("en-MY", {
    minimumFractionDigits: 0,
  })}`;
};
