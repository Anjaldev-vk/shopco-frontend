export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";
  return `₹${Number(amount).toFixed(2)}`;
};
